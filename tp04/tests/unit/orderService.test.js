const { createOrderService } = require('../../src/orders/orderService');

describe('orderService.placeOrder', () => {
  const customerEmail = 'sara@test.tn';
  const items = [{ productId: 1, quantity: 2, unitPrice: 24.9 }];

  let paymentGateway;
  let orderRepository;
  let mailer;
  let service;

  beforeEach(() => {
    paymentGateway = { charge: jest.fn().mockResolvedValue({ ok: true }) };
    orderRepository = { save: jest.fn(async (order) => ({ ...order, id: 42 })) };
    mailer = { send: jest.fn().mockResolvedValue() };
    service = createOrderService({ paymentGateway, orderRepository, mailer });
  });

  test('paiement accepté : la commande est enregistrée avec le statut confirmed', async () => {
    const order = await service.placeOrder({ customerEmail, items });

    expect(orderRepository.save).toHaveBeenCalledTimes(1);
    expect(order.id).toBe(42);
    expect(order.status).toBe('confirmed');
  });

  test('paiement refusé : rien n\'est enregistré et aucun e-mail n\'est envoyé', async () => {
    paymentGateway.charge.mockResolvedValue({ ok: false });

    await expect(service.placeOrder({ customerEmail, items })).rejects.toThrow('Paiement refusé');

    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('paiement accepté : un seul e-mail est envoyé, au client', async () => {
    await service.placeOrder({ customerEmail, items });

    expect(mailer.send).toHaveBeenCalledTimes(1);
    expect(mailer.send).toHaveBeenCalledWith(customerEmail, 'Commande 42 confirmée');
  });

  test('e-mail en panne : la commande reste confirmée', async () => {
    mailer.send.mockRejectedValue(new Error('SMTP indisponible'));

    const order = await service.placeOrder({ customerEmail, items });

    expect(order.status).toBe('confirmed');
  });

  test('commande vide : erreur et aucun paiement demandé', async () => {
    await expect(service.placeOrder({ customerEmail, items: [] })).rejects.toThrow('Commande vide');

    expect(paymentGateway.charge).not.toHaveBeenCalled();
  });

  test('le total est arrondi à 2 décimales', async () => {
    await service.placeOrder({ customerEmail, items: [{ productId: 3, quantity: 3, unitPrice: 0.1 }] });

    expect(paymentGateway.charge).toHaveBeenCalledWith({ amount: 0.3, email: customerEmail });
  });
});
