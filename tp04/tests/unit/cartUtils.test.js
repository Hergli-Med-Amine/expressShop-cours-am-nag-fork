const {
  calculateItemTotal,
  calculateCartTotal,
  applyDiscountCode,
  isEligibleForFreeShipping,
} = require('../../src/utils/cartUtils');

describe('calculateItemTotal', () => {
  test('un article à 10 DT, quantité 1', () => {
    expect(calculateItemTotal(10, 1)).toBe(10);
  });

  test('arrondit correctement à 2 décimales', () => {
    expect(calculateItemTotal(19.99, 3)).toBeCloseTo(59.97, 2);
  });

  test('quantité 0 donne 0', () => {
    expect(calculateItemTotal(19.99, 0)).toBe(0);
  });

  test('prix gratuit (0 DT)', () => {
    expect(calculateItemTotal(0, 5)).toBe(0);
  });
});

describe('calculateCartTotal', () => {
  test('panier vide renvoie 0', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  test('un seul article', () => {
    expect(calculateCartTotal([{ price: 25, quantity: 2 }])).toBeCloseTo(50, 2);
  });

  test('plusieurs articles', () => {
    const items = [
      { price: 19.99, quantity: 2 },
      { price: 5, quantity: 1 },
    ];
    expect(calculateCartTotal(items)).toBeCloseTo(44.98, 2);
  });
});

describe('applyDiscountCode', () => {
  test('remise de 10 % sur 100 DT', () => {
    expect(applyDiscountCode(100, 10)).toBeCloseTo(90, 2);
  });

  test('0 % est une valeur limite valide', () => {
    expect(applyDiscountCode(100, 0)).toBeCloseTo(100, 2);
  });

  test('100 % pile est une valeur limite valide (tout gratuit)', () => {
    expect(applyDiscountCode(100, 100)).toBeCloseTo(0, 2);
  });

  test('lève une RangeError au-dessus de 100', () => {
    expect(() => applyDiscountCode(100, 101)).toThrow(RangeError);
  });

  test('lève une RangeError en dessous de 0', () => {
    expect(() => applyDiscountCode(100, -5)).toThrow(RangeError);
  });

  test.each([['10', 90], ['0', 100], ['100', 0]])('accepte le texte %p (règle R3)', (percent, expected) => {
    expect(applyDiscountCode(100, percent)).toBeCloseTo(expected, 2);
  });

  test.each(['dix', '', 'NaN', null, undefined])('refuse %p avec une TypeError', (percent) => {
    expect(() => applyDiscountCode(100, percent)).toThrow(TypeError);
  });
});

describe('isEligibleForFreeShipping', () => {
  test('250 DT est éligible', () => {
    expect(isEligibleForFreeShipping(250)).toBe(true);
  });

  test('200 DT pile est éligible (valeur limite)', () => {
    expect(isEligibleForFreeShipping(200)).toBe(true);
  });

  test('199.99 DT n’est pas éligible (juste sous la limite)', () => {
    expect(isEligibleForFreeShipping(199.99)).toBe(false);
  });

  test('0 DT n’est pas éligible', () => {
    expect(isEligibleForFreeShipping(0)).toBe(false);
  });
});
