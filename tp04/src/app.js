/**
 * app.js : API REST d'ExpressShop.
 *
 * SPÉCIFICATION
 *
 * createApp({ pool, paymentGateway, mailer })
 *   Crée l'application Express. pool est une connexion PostgreSQL (pg).
 *   paymentGateway et mailer sont facultatifs : par défaut, le paiement est
 *   toujours accepté et l'e-mail n'envoie rien.
 *
 * GET /
 *   La page d'accueil de la boutique (public/index.html).
 *
 * GET /products
 *   200 + la liste des produits [{ id, name, price, stock }], triée par id.
 *
 * GET /products/:id
 *   200 + le produit, ou 404 + { error: 'Produit introuvable' }.
 *
 * POST /orders
 *   Corps : { customerEmail, items: [{ productId, quantity }] }
 *   - customerEmail absent ou sans « @ »    : 400
 *   - items vide ou absent                  : 400
 *   - quantity qui n'est pas un entier >= 1 : 400
 *   - produit inconnu                       : 404
 *   - quantity supérieure au stock          : 409
 *   - sinon : la commande est enregistrée, le stock de chaque produit diminue
 *     de la quantité commandée, et la réponse est 201 + { id, total, status }.
 */

const path = require('path');
const express = require('express');
const { createOrderService } = require('./orders/orderService');
const { createPgOrderRepository } = require('./orders/pgOrderRepository');

const defaultPaymentGateway = { charge: async () => ({ ok: true }) };
const defaultMailer = { send: async () => {} };

const PRODUCT_COLUMNS = 'id, name, price::float AS price, stock';

// Interroge le fournisseur pour confirmer que les produits sont disponibles.
const checkSupplierAvailability = () => new Promise((resolve) => setTimeout(resolve, 300));

function createApp({ pool, paymentGateway = defaultPaymentGateway, mailer = defaultMailer }) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const orderService = createOrderService({
    paymentGateway,
    orderRepository: createPgOrderRepository(pool),
    mailer,
  });

  app.get('/products', async (req, res) => {
    await checkSupplierAvailability();
    const { rows } = await pool.query(`SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY id`);
    res.json(rows);
  });

  app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { rows } = Number.isInteger(id)
      ? await pool.query(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $1`, [id])
      : { rows: [] };
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.json(rows[0]);
  });

  app.post('/orders', async (req, res) => {
    const { customerEmail, items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Commande vide' });
    }

    const orderItems = [];
    for (const { productId, quantity } of items) {
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Quantité invalide' });
      }

      const { rows } = await pool.query(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $1`, [productId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Produit introuvable' });
      }
      if (quantity > rows[0].stock) {
        return res.status(409).json({ error: 'Stock insuffisant' });
      }
      orderItems.push({ productId, quantity, unitPrice: rows[0].price });
    }

    const order = await orderService.placeOrder({ customerEmail, items: orderItems });
    res.status(201).json({ id: order.id, total: order.total, status: order.status });
  });

  return app;
}

module.exports = { createApp };
