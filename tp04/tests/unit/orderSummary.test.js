const { formatOrderSummary } = require('../../src/utils/orderSummary');

describe('formatOrderSummary', () => {
  const base = { id: 7, customerEmail: 'Sara@Test.tn', total: 49.8, status: 'confirmed' };

  test('un seul article : « article » au singulier', () => {
    const order = { ...base, items: [{ quantity: 1, unitPrice: 49.8 }] };
    expect(formatOrderSummary(order)).toBe('Commande 7 : 1 article, total 49.8 € (confirmed)');
  });

  test('plusieurs articles : les quantités s\'additionnent, « articles » au pluriel', () => {
    const order = { ...base, items: [{ quantity: 2, unitPrice: 10 }, { quantity: 1, unitPrice: 29.8 }] };
    expect(formatOrderSummary(order)).toBe('Commande 7 : 3 articles, total 49.8 € (confirmed)');
  });
});
