const productsElement = document.getElementById('products');
const messageElement = document.getElementById('message');
const emailInput = document.getElementById('email');

function showMessage(text, kind) {
  messageElement.textContent = text;
  messageElement.className = kind;
}

function renderProduct(product) {
  const article = document.createElement('article');
  article.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.price.toFixed(2)} €</p>
    <p>Stock : <span data-testid="stock-${product.id}">${product.stock}</span></p>
    <button type="button" aria-label="Commander ${product.name}">Commander</button>
  `;
  article.querySelector('button').addEventListener('click', () => order(product));
  return article;
}

async function loadProducts() {
  const response = await fetch('/products');
  const products = await response.json();
  productsElement.replaceChildren(...products.map(renderProduct));
}

async function order(product) {
  const response = await fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerEmail: emailInput.value,
      items: [{ productId: product.id, quantity: 1 }],
    }),
  });
  const body = await response.json();
  if (response.ok) {
    showMessage(`Commande ${body.id} confirmée, total ${body.total.toFixed(2)} €`, 'ok');
  } else {
    showMessage(body.error || 'Erreur', 'error');
  }
  await loadProducts();
}

loadProducts();
