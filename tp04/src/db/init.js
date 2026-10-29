/**
 * init.js : crée les tables d'ExpressShop et insère les produits de départ.
 *
 * initDb(pool) supprime puis recrée les tables : après l'appel, la base est
 * toujours dans le même état (3 produits, aucune commande).
 */

const SCHEMA = `
  DROP TABLE IF EXISTS order_items;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS products;

  CREATE TABLE products (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL
  );

  CREATE TABLE orders (
    id             SERIAL PRIMARY KEY,
    customer_email TEXT NOT NULL,
    total          NUMERIC(10, 2) NOT NULL,
    status         TEXT NOT NULL
  );

  CREATE TABLE order_items (
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
  );

  INSERT INTO products (name, price, stock) VALUES
    ('Souris sans fil', 24.90, 10),
    ('Clavier mécanique', 119.00, 5),
    ('Câble USB', 19.99, 50);
`;

async function initDb(pool) {
  await pool.query(SCHEMA);
}

module.exports = { initDb };
