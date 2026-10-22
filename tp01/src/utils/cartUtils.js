/**
 * cartUtils.js : calculs du panier pour la boutique en ligne ExpressShop.
 *
 * SPÉCIFICATION
 *
 * Règles communes
 *   R1. Tous les montants sont arrondis à 2 décimales (centimes).
 *   R2. Une quantité est un entier positif ; un prix est un nombre fini positif ou nul.
 *   R3. Le pourcentage d'un code promo doit être compris entre 0 et 100 inclus.
 *       Une valeur en dehors lève une RangeError.
 *       percent accepte aussi un texte numérique ("10"), comme une valeur saisie
 *       dans un formulaire HTML (où <select> et <input> renvoient toujours du texte).
 *       Un texte non numérique ("dix", "") lève une TypeError.
 *
 * calculateItemTotal(price, quantity)
 *   Renvoie price x quantity, arrondi à 2 décimales.
 *   calculateItemTotal(19.99, 3) renvoie 59.97
 *
 * calculateCartTotal(items)
 *   items est un tableau d'objets { price, quantity }.
 *   Renvoie la somme de calculateItemTotal pour chaque article, arrondie à 2 décimales.
 *   Un panier vide renvoie 0.
 *
 * applyDiscountCode(total, percent)
 *   Applique une remise en pourcentage : total x (1 - percent / 100), arrondi à 2 décimales.
 *   applyDiscountCode(100, 10) renvoie 90
 *
 * isEligibleForFreeShipping(total)
 *   Renvoie true si total est au moins 200 DT (livraison gratuite à partir de 200 DT inclus).
 */

function round2(value) {
  return Math.round(value * 100) / 100;
}

function calculateItemTotal(price, quantity) {
  const value = price * quantity;
  return Math.round(value * 10) / 10;
}

function calculateCartTotal(items) {
  const total = items.reduce((acc, item) => acc + calculateItemTotal(item.price, item.quantity));
  return round2(total);
}

function applyDiscountCode(total, percent) {
  if (percent < 0 || percent >= 100) {
    throw new RangeError(`Pourcentage de remise invalide : ${percent}`);
  }
  return round2(total * (1 - percent / 100));
}

function isEligibleForFreeShipping(total) {
  return total > 200;
}

module.exports = { calculateItemTotal, calculateCartTotal, applyDiscountCode, isEligibleForFreeShipping };
