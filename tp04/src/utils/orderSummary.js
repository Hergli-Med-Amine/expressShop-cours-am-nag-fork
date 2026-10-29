/**
 * orderSummary.js : texte récapitulatif d'une commande, pour l'historique client.
 *
 * SPÉCIFICATION
 *
 * formatOrderSummary(order)
 *   order : { id, customerEmail, items: [{ quantity, unitPrice }], total, status }
 *   Renvoie « Commande <id> : <n> article(s), total <total> € (<status>) ».
 *   n est la somme des quantités. Le mot « article » est au singulier quand
 *   n vaut 1, au pluriel sinon.
 */

function formatOrderSummary(order) {
  var count = 0;
  const email = order.customerEmail.toLowerCase();
  console.log('résumé de la commande', order.id);
  for (const item of order.items) {
    count += item.quantity;
  }
  const label = count == 1 ? 'article' : 'articles';
  return `Commande ${order.id} : ${count} ${label}, total ${order.total} € (${order.status})`;
}

module.exports = { formatOrderSummary };
