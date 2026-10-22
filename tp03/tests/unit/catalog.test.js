const { getProductById, getProductsByCategory, checkStock } = require('../../src/catalog/catalogService');

describe('getProductById', () => {
  // async / await : on attend la promesse avec await, puis on vérifie le résultat.
  test('renvoie le produit pour un id existant', async () => {
    const product = await getProductById(1);
    expect(product).toEqual({ id: 1, name: 'Casque Bluetooth', category: 'audio', price: 89.9, stock: 12 });
  });

  // .rejects : on vérifie que la promesse est REJETÉE, avec le bon message.
  // expect.assertions(1) : Jest échoue si cette assertion n'a pas réellement été exécutée.
  // Révèle BUG-K1 (le code résout avec undefined au lieu de rejeter).
  test('rejette un id inconnu', async () => {
    expect.assertions(1);
    await expect(getProductById(999)).rejects.toThrow('Produit introuvable : 999');
  });
});

describe('getProductsByCategory', () => {
  // Une catégorie connue renvoie ses produits dans l'ordre du catalogue.
  test('renvoie les produits de la catégorie', async () => {
    const products = await getProductsByCategory('audio');
    expect(products.map((p) => p.id)).toEqual([1, 2]);
  });

  // La casse est ignorée. test.each : un test écrit une fois, exécuté pour chaque valeur.
  // Révèle BUG-K2 (le code compare la catégorie telle quelle, sans ignorer la casse).
  test.each(['Audio', 'AUDIO', 'aUdIo'])('ignore la casse : %s', async (category) => {
    const products = await getProductsByCategory(category);
    expect(products).toHaveLength(2);
  });

  // Une catégorie inconnue donne un tableau vide, pas une erreur.
  test('renvoie un tableau vide pour une catégorie inconnue', async () => {
    await expect(getProductsByCategory('jardin')).resolves.toEqual([]);
  });
});

describe('checkStock', () => {
  // .resolves : on vérifie la valeur dont la promesse est résolue.
  // Le produit 2 a un stock de 0 : la demande d'une unité est donc refusée.
  test('renvoie false quand le stock est insuffisant', async () => {
    await expect(checkStock(2, 1)).resolves.toBe(false);
  });

  // Le produit 3 a un stock de 3 : demander exactement 3 est accepté (valeur limite).
  test('renvoie true quand le stock est suffisant, limite comprise', async () => {
    await expect(checkStock(3, 3)).resolves.toBe(true);
    await expect(checkStock(3, 4)).resolves.toBe(false);
  });

  // Une quantité qui n'est pas un entier >= 1 rejette la promesse avec une RangeError.
  // Révèle BUG-K3 (le code ne valide pas la quantité).
  test.each([[0], [-1], [1.5]])('rejette la quantité %p', async (quantity) => {
    await expect(checkStock(1, quantity)).rejects.toThrow(RangeError);
  });

  // Un id inconnu rejette comme getProductById.
  test('rejette un id inconnu', async () => {
    await expect(checkStock(999, 1)).rejects.toThrow('Produit introuvable : 999');
  });
});
