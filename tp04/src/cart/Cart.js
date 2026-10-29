/**
 * Cart.js : panier de la boutique en ligne ExpressShop.
 *
 * SPÉCIFICATION
 *
 * new Cart()
 *   Crée un panier vide.
 *
 * addItem({ id, name, price, quantity })
 *   Ajoute un article au panier.
 *   - Si un article avec le même id est déjà dans le panier, on additionne les
 *     quantités : le panier ne contient jamais deux lignes avec le même id.
 *   - quantity doit être un entier supérieur ou égal à 1, sinon RangeError.
 *   - price doit être un nombre fini supérieur ou égal à 0, sinon RangeError.
 *
 * removeItem(id)
 *   Retire l'article qui porte cet id.
 *   Si aucun article ne porte cet id, le panier ne change pas (aucune erreur).
 *
 * getItems()
 *   Renvoie la liste des articles { id, name, price, quantity }, dans l'ordre
 *   d'ajout. Le résultat est une COPIE : le modifier ne doit jamais modifier
 *   le panier.
 *
 * getTotalQuantity()
 *   Renvoie le nombre total d'unités dans le panier (somme des quantités).
 *   Panier vide : 0.
 *
 * getTotal()
 *   Renvoie le montant total du panier (somme de price x quantity), arrondi à
 *   2 décimales. Panier vide : 0.
 *
 * clear()
 *   Vide le panier.
 */

function round2(value) {
  return Math.round(value * 100) / 100;
}

class Cart {
  constructor() {
    this.items = [];
  }

  addItem({ id, name, price, quantity }) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new RangeError(`Quantité invalide : ${quantity}`);
    }
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      throw new RangeError(`Prix invalide : ${price}`);
    }
    const existing = this.items.find((item) => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ id, name, price, quantity });
    }
  }

  removeItem(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  getItems() {
    return this.items.map((item) => ({ ...item }));
  }

  getTotalQuantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return round2(total);
  }

  clear() {
    this.items = [];
  }
}

module.exports = { Cart };
