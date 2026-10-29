/**
 * server.js : démarre l'API ExpressShop sur un port, avec une vraie base PostgreSQL.
 *
 * Variables d'environnement (toutes facultatives) :
 *   DATABASE_URL : adresse de la base (par défaut la base du docker-compose.yml)
 *   PORT         : port d'écoute (par défaut 3000)
 */

const { Pool } = require('pg');
const { createApp } = require('./app');
const { initDb } = require('./db/init');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/expressshop';
const PORT = Number(process.env.PORT) || 3000;

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  await initDb(pool);
  const app = createApp({ pool });
  app.listen(PORT, () => {
    console.log(`ExpressShop écoute sur http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error('Démarrage impossible :', error.message);
  process.exit(1);
});
