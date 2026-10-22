const { capitalize, slugify, countVowels } = require('../../src/utils/textUtils');

describe('capitalize', () => {
  test('met la première lettre en majuscule', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('ne modifie pas le reste du texte', () => {
    // Arrange
    const input = 'nike air max';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('Nike air max');
  });

  test('laisse intact un texte qui commence déjà par une majuscule', () => {
    expect(capitalize('Hello WORLD')).toBe('Hello WORLD');
  });

  test('gère un texte d’un seul caractère', () => {
    expect(capitalize('a')).toBe('A');
  });

  test('renvoie une chaîne vide pour une chaîne vide', () => {
    expect(capitalize('')).toBe('');
  });

  test('renvoie null tel quel', () => {
    expect(capitalize(null)).toBeNull();
  });

  test('renvoie undefined tel quel', () => {
    expect(capitalize(undefined)).toBeUndefined();
  });
});

describe('slugify', () => {
  test('exemple de la spécification', () => {
    expect(slugify('Écran PC (24 pouces) !')).toBe('ecran-pc-24-pouces');
  });

  test('met tout en minuscules', () => {
    expect(slugify('CASQUE')).toBe('casque');
  });

  test('supprime les accents', () => {
    expect(slugify('Étagère Élégante')).toBe('etagere-elegante');
  });

  test('remplace une suite de séparateurs par un seul tiret', () => {
    expect(slugify('a   --  b')).toBe('a-b');
  });

  test('ne laisse pas de tiret au début', () => {
    expect(slugify('!Promo')).toBe('promo');
  });

  test('ne laisse pas de tiret à la fin', () => {
    expect(slugify('Promo !')).toBe('promo');
  });

  test.each([[''], [null], [undefined]])('renvoie une chaîne vide pour %p', (value) => {
    expect(slugify(value)).toBe('');
  });
});

describe('countVowels', () => {
  test('compte les voyelles en minuscules', () => {
    expect(countVowels('bonjour')).toBe(3);
  });

  test('compte les voyelles en majuscules', () => {
    expect(countVowels('BONJOUR')).toBe(3);
  });

  test('compte le y comme une voyelle', () => {
    expect(countVowels('yes')).toBe(2);
  });

  test('renvoie 0 pour un texte sans voyelle', () => {
    expect(countVowels('brr')).toBe(0);
  });

  test.each([[''], [null], [undefined]])('renvoie 0 pour %p', (value) => {
    expect(countVowels(value)).toBe(0);
  });

  test.todo('ÉLÈVE : la spécification ne dit rien des lettres accentuées, à clarifier');
});
