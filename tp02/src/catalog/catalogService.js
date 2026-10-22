/**
 * catalogService.js : accès asynchrone au catalogue produits d'ExpressShop.
 *
 * Les fonctions simulent une base de données : elles répondent après un court
 * délai et renvoient donc des PROMESSES (Promise).
 *
 * SPÉCIFICATION
 *
 * getProductById(id)
 *   Renvoie une promesse résolue avec le produit { id, name, category, price, stock }.
 *   Si aucun produit ne porte cet id, la promesse est REJETÉE avec une
 *   Error dont le message est « Produit introuvable : <id> ».
 *
 * getProductsByCategory(category)
 *   Renvoie une promesse résolue avec le tableau des produits de cette
 *   catégorie, dans l'ordre du catalogue. La casse est ignorée : « audio »,
 *   « Audio » et « AUDIO » donnent le même résultat.
 *   Une catégorie inconnue donne un tableau vide (pas d'erreur).
 *
 * checkStock(id, quantity)
 *   Renvoie une promesse résolue avec true si le stock du produit est
 *   supérieur ou égal à quantity, false sinon.
 *   - quantity doit être un entier supérieur ou égal à 1, sinon la promesse
 *     est rejetée avec une RangeError.
 *   - Un id inconnu rejette la promesse comme getProductById.
 */

const PRODUCTS = [
  { id: 1, name: 'Casque Bluetooth', category: 'audio', price: 89.9, stock: 12 },
  { id: 2, name: 'Enceinte portable', category: 'audio', price: 59, stock: 0 },
  { id: 3, name: 'Aspirateur robot', category: 'maison', price: 249, stock: 3 },
  { id: 4, name: 'Bouilloire inox', category: 'maison', price: 39.5, stock: 25 },
  { id: 5, name: 'Souris sans fil', category: 'informatique', price: 24.9, stock: 40 },
  { id: 6, name: 'Clavier mécanique', category: 'informatique', price: 119, stock: 7 },
];

const DELAY_MS = 20;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getProductById(id) {
  await wait(DELAY_MS);
  const product = PRODUCTS.find((p) => p.id === id);
  return product ? { ...product } : undefined;
}

async function getProductsByCategory(category) {
  await wait(DELAY_MS);
  return PRODUCTS.filter((p) => p.category === category).map((p) => ({ ...p }));
}

async function checkStock(id, quantity) {
  const product = await getProductById(id);
  if (!product) {
    throw new Error(`Produit introuvable : ${id}`);
  }
  return product.stock >= quantity;
}

module.exports = { getProductById, getProductsByCategory, checkStock };
