const { Cart } = require('../../src/cart/Cart');

const cart = new Cart();

// T1
test('ajout', () => {
  cart.addItem({ id: 1, name: 'Souris sans fil', price: 24.9, quantity: 1 });
  expect(cart.getItems().length).toBe(1);
});

// T2
test('total', () => {
  expect(cart.getTotal()).toBe(24.9);
});

// T3
test('doublon', () => {
  const c = new Cart();
  c.addItem({ id: 2, name: 'Câble USB', price: 19.99, quantity: 2 });
  c.addItem({ id: 2, name: 'Câble USB', price: 19.99, quantity: 3 });
  c.getTotalQuantity();
});

// T4
test('test 4', () => {
  const c = new Cart();
  c.addItem({ id: 1, name: 'Souris sans fil', price: 24.9, quantity: 1 });
  c.addItem({ id: 2, name: 'Clavier mécanique', price: 119, quantity: 1 });
  expect(c.getItems().length).toBe(2);
  c.removeItem(99);
  expect(c.getItems().length).toBe(2);
  c.removeItem(1);
  expect(c.getItems().length).toBe(1);
  expect(c.getTotal()).toBe(119);
  c.clear();
  expect(c.getItems().length).toBe(0);
});

// T5
test('quantité aléatoire', () => {
  const quantity = Math.floor(Math.random() * 2);
  const c = new Cart();
  c.addItem({ id: 3, name: 'Câble HDMI', price: 10, quantity });
  expect(c.getTotal()).toBe(10 * quantity);
});

// T6
test('affichage', () => {
  const c = new Cart();
  c.addItem({ id: 4, name: 'Clavier mécanique', price: 119, quantity: 1 });
  console.log('Total du panier :', c.getTotal());
});
