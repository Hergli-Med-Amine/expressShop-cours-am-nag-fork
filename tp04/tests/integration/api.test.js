const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { Pool } = require('pg');
const request = require('supertest');
const { createApp } = require('../../src/app');
const { initDb } = require('../../src/db/init');

describe('API ExpressShop', () => {
  let container;
  let pool;
  let app;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start();
    pool = new Pool({ connectionString: container.getConnectionUri() });
    app = createApp({ pool });
  }, 120000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  beforeEach(async () => {
    await initDb(pool);
  });

  test('GET /products renvoie la liste des produits', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0].name).toBe('Souris sans fil');
  });

  test('GET /products/:id renvoie 404 pour un produit inconnu', async () => {
    const response = await request(app).get('/products/999');

    expect(response.status).toBe(404);
  });

  test('POST /orders crée la commande et fait diminuer le stock', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ customerEmail: 'sara@test.tn', items: [{ productId: 1, quantity: 2 }] });

    expect(response.status).toBe(201);
    expect(response.body.total).toBe(49.8);
    expect(response.body.status).toBe('confirmed');

    const product = await request(app).get('/products/1');
    expect(product.body.stock).toBe(8);
  });

  test.each([[0], [-1]])('POST /orders avec la quantité %p renvoie 400', async (quantity) => {
    const response = await request(app)
      .post('/orders')
      .send({ customerEmail: 'sara@test.tn', items: [{ productId: 1, quantity }] });

    expect(response.status).toBe(400);
  });

  test('POST /orders avec un produit inconnu renvoie 404', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ customerEmail: 'sara@test.tn', items: [{ productId: 999, quantity: 1 }] });

    expect(response.status).toBe(404);
  });

  test('POST /orders avec une quantité supérieure au stock renvoie 409', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ customerEmail: 'sara@test.tn', items: [{ productId: 1, quantity: 11 }] });

    expect(response.status).toBe(409);
  });
});
