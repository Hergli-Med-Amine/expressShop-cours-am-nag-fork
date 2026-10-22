/**
 * textUtils.js : fonctions de texte utilisées par le catalogue produits de ExpressShop.
 *
 * SPÉCIFICATION:
 *
 * capitalize(text)
 *   - Met en majuscule la première lettre du texte.
 *   - Le reste du texte n'est PAS modifié.
 *   - capitalize("nike air max") renvoie "Nike air max"
 *   - "" renvoie ""
 *   - null et undefined sont renvoyés tels quels (pas d'erreur).
 *
 * slugify(title)
 *   - Transforme un titre de produit en identifiant utilisable dans une URL.
 *   - Tout en minuscules, sans accents (é devient e).
 *   - Chaque suite de caractères qui ne sont ni des lettres ni des chiffres
 *     est remplacée par un seul tiret "-".
 *   - Jamais de tiret au début ni à la fin du résultat.
 *   - slugify("Écran PC (24 pouces) !") renvoie "ecran-pc-24-pouces"
 *   - "", null et undefined renvoient "".
 *
 * countVowels(text)
 *   - Renvoie le nombre de voyelles du texte : a, e, i, o, u, y,
 *     en majuscules ou en minuscules.
 *   - "" renvoie 0 ; null et undefined renvoient 0.
 *   - (La spécification ne dit rien des lettres accentuées.)
 */

function capitalize(text) {
  if (text === null || text === undefined) return text;
  if (text === '') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function slugify(title) {
  if (!title) return '';
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

function countVowels(text) {
  if (!text) return 0;
  const matches = text.match(/[aeiouy]/gi);
  return matches ? matches.length : 0;
}

module.exports = { capitalize, slugify, countVowels };
