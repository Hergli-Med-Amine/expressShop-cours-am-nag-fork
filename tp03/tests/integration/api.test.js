const { Pool } = require('pg');
const request = require('supertest');
const { initDb } = require('../../src/db/init');

describe('ExpressShop API', () => {
    let container;
    let pool;
    let app;

    beforeAll(async () => {
        // Initialize the database container
        container = await new PostgresContainer('postgres:16-alpine').start();
        pool = new Pool({connectionString: container.getConnectionUrl()});
        app = createApp({pool});
    })

    afterAll(async () => {
        await pool.end();
        await container.stop();
    })

    beforeEach(async () => {
        // Initialize the database schema and seed data before each test
        await initDb(pool);
    })

    test('GET /api/products should return a list of products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    })
})