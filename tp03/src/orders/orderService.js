/**
 * orderService.js : validation d'une commande dans ExpressShop.
 *
 * SPÉCIFICATION
 *
 * createOrderService({ paymentGateway, orderRepository, mailer })
 *   Crée le service. Les trois dépendances sont données en paramètre :
 *   - paymentGateway.charge({ amount, email })  -> Promise<{ ok: boolean }>
 *   - orderRepository.save(order)               -> Promise<order enregistrée, avec un id>
 *   - mailer.send(to, message)                  -> Promise<void>
 *
 * placeOrder({ customerEmail, items })
 *   items est une liste de { productId, quantity, unitPrice }.
 *
 *   1. Si items est vide : lève une Error('Commande vide'). Rien d'autre ne se passe.
 *   2. Le total est la somme de quantity x unitPrice, arrondie à 2 décimales.
 *   3. Le service demande le paiement au paymentGateway.
 *   4. Si le paiement est refusé : lève une Error('Paiement refusé').
 *      La commande n'est PAS enregistrée et AUCUN e-mail n'est envoyé.
 *   5. Si le paiement est accepté : la commande est enregistrée avec le statut
 *      'confirmed', puis un e-mail de confirmation est envoyé UNE seule fois,
 *      à customerEmail, avec le message 'Commande <id> confirmée'.
 *   6. Si l'envoi de l'e-mail échoue, la commande reste confirmée : placeOrder
 *      ne lève aucune erreur.
 *   7. placeOrder renvoie la commande enregistrée.
 */

function createOrderService({ paymentGateway, orderRepository, mailer }) {
  async function placeOrder({ customerEmail, items }) {
    if (items.length === 0) {
      throw new Error('Commande vide');
    }

    const rawTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const total = Math.round(rawTotal * 100) / 100;

    const order = await orderRepository.save({
      customerEmail,
      items,
      total,
      status: 'confirmed',
    });

    const payment = await paymentGateway.charge({ amount: total, email: customerEmail });
    if (!payment.ok) {
      throw new Error('Paiement refusé');
    }

    await mailer.send(customerEmail, `Commande ${order.id} confirmée`);

    return order;
  }

  return { placeOrder };
}

module.exports = { createOrderService };
