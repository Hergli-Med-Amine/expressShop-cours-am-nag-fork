/**
 * pgOrderRepository.js : enregistre une commande dans PostgreSQL.
 *
 * save(order) insère la commande et ses lignes, et retire du stock de chaque
 * produit la quantité commandée. Tout se fait dans une transaction : si une
 * étape échoue, rien n'est enregistré.
 * Renvoie la commande avec son id.
 */

function createPgOrderRepository(pool) {
  async function save(order) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const inserted = await client.query(
        'INSERT INTO orders (customer_email, total, status) VALUES ($1, $2, $3) RETURNING id',
        [order.customerEmail, order.total, order.status],
      );
      const orderId = inserted.rows[0].id;

      for (const item of order.items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [orderId, item.productId, item.quantity, item.unitPrice],
        );
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.productId],
        );
      }

      await client.query('COMMIT');
      return { ...order, id: orderId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  return { save };
}

module.exports = { createPgOrderRepository };
