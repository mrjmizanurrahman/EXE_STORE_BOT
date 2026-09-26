const products = [
  { id: 'vpn', name: 'Private VPN', category: 'Privacy', icon: '◉', tag: 'POPULAR', price: 4.99, description: 'Privacy-minded browsing for your everyday devices.' },
  { id: 'proxy', name: 'Proxy Service', category: 'Privacy', icon: '⌁', tag: 'FLEXIBLE', price: 3.50, description: 'Reliable proxy options for legitimate online workflows.' },
  { id: 'email', name: 'Secure Email', category: 'Email', icon: '✉', tag: 'ESSENTIAL', price: 2.99, description: 'A simple email solution for work and personal use.' },
  { id: 'workspace', name: 'Work Suite', category: 'Productivity', icon: '▤', tag: 'WORK SMART', price: 7.99, description: 'Digital productivity tools to help your ideas flow.' },
  { id: 'ai-tools', name: 'AI Tools Guide', category: 'Productivity', icon: '✳', tag: 'CREATIVE', price: 5.00, description: 'Discover useful AI tools and practical workflows.' },
  { id: 'security-key', name: 'Security Key', category: 'Security', icon: '⚿', tag: 'SAFER SIGN-IN', price: 9.99, description: 'A hardware security key for stronger account protection.' },
  { id: 'cloud', name: 'Cloud Storage', category: 'Productivity', icon: '☁', tag: 'MORE SPACE', price: 3.99, description: 'Extra room for your files, projects and memories.' },
  { id: 'domain', name: 'Domain Starter', category: 'Email', icon: '⌘', tag: 'BUILD ONLINE', price: 6.50, description: 'Get started with a domain for your next project.' }
];

const productGrid = document.getElementById('productGrid');
const productSearch = document.getElementById('productSearch');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const overlay = document.getElementById('overlay');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const cart = new Map();
let activeCategory = 'All';

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesQuery = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`;
  emptyState.hidden = filtered.length !== 0;
  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <a class="product-card-link" href="#product/${product.id}" aria-label="View ${product.name}"><div class="product-art"><span class="product-tag">${product.tag}</span><span class="product-symbol" aria-hidden="true">${product.icon}</span></div></a>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3><a class="product-title-link" href="#product/${product.id}">${product.name}</a></h3>
        <p>${product.description}</p>
        <div class="product-bottom"><span class="price">${formatPrice(product.price)} <small>USD</small></span><button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button></div>
      </div>
    </article>`).join('');
}

function renderProductPage() {
  const match = window.location.hash.match(/^#product\/([\w-]+)$/);
  const product = match && products.find((item) => item.id === match[1]);
  const page = document.getElementById('productPage');
  const storeSections = document.querySelectorAll('main > .hero, main > .shop-section, main > .why-section, main > .help-strip, .site-footer');

  storeSections.forEach((section) => { section.hidden = Boolean(product); });
  page.hidden = !product;
  if (!product) return;

  page.innerHTML = `
    <a class="detail-back" href="#shop">← Back to shop</a>
    <div class="detail-layout">
      <div class="detail-art"><span class="product-tag">${product.tag}</span><span class="product-symbol" aria-hidden="true">${product.icon}</span></div>
      <div class="detail-copy">
        <span class="product-category">${product.category}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="detail-price">${formatPrice(product.price)} <small>USD</small></div>
        <p class="detail-note">Digital product · Order details confirmed at checkout</p>
        <div class="detail-actions"><button class="primary-link" data-detail-add="${product.id}">Add to cart</button><button class="checkout-button" data-buy-now="${product.id}">Buy now <span>→</span></button></div>
        <div class="detail-payments"><strong>Payment options at checkout</strong><span>bKash · Nagad · Upay · Binance Pay</span></div>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function updateCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === id).price * quantity, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('drawerCount').textContent = `(${count})`;
  document.getElementById('cartTotal').textContent = formatPrice(total);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
  cartEmpty.hidden = count > 0;
  cartSummary.hidden = count === 0;
  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `<div class="cart-line"><span class="cart-thumb" aria-hidden="true">${product.icon}</span><div><strong>${product.name}</strong><small>${formatPrice(product.price)} each</small><div class="quantity-control"><button data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button><button class="remove-item" data-remove="${id}">Remove</button></div></div><span class="cart-line-total">${formatPrice(product.price * quantity)}</span></div>`;
  }).join('');
}

function showOverlay() {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('visible'));
  document.body.classList.add('modal-open');
}

function hideOverlay() {
  overlay.classList.remove('visible');
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains('open') && !checkoutModal.classList.contains('open')) overlay.hidden = true;
  }, 220);
  document.body.classList.remove('modal-open');
}

function openCart() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  showOverlay();
}

function openCheckout() {
  if (!cart.size) return;
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  document.getElementById('orderSuccess').hidden = true;
  checkoutForm.hidden = false;
  showOverlay();
}

function closePanels() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  hideOverlay();
}

productGrid.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (!addButton) {
    const card = event.target.closest('.product-card');
    const productLink = card && card.querySelector('.product-card-link');
    if (productLink && !event.target.closest('a')) window.location.hash = productLink.getAttribute('href');
    return;
  }
  const id = addButton.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  addButton.textContent = '✓';
  window.setTimeout(() => { if (addButton.isConnected) addButton.textContent = '+'; }, 750);
});

document.getElementById('productPage').addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-detail-add]');
  const buyButton = event.target.closest('[data-buy-now]');
  const button = addButton || buyButton;
  if (!button) return;
  const id = button.dataset.detailAdd || button.dataset.buyNow;
  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  if (buyButton) openCheckout();
  else {
    button.textContent = 'Added to cart ✓';
    window.setTimeout(() => { if (button.isConnected) button.textContent = 'Add to cart'; }, 900);
  }
});

window.addEventListener('hashchange', renderProductPage);

document.getElementById('filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll('.filter').forEach((filter) => filter.classList.toggle('active', filter === button));
  renderProducts();
});

productSearch.addEventListener('input', renderProducts);
document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => productSearch.focus(), 350);
});
document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closePanels);
document.getElementById('continueShopping').addEventListener('click', closePanels);
document.getElementById('checkoutButton').addEventListener('click', openCheckout);
document.getElementById('closeCheckout').addEventListener('click', closePanels);
overlay.addEventListener('click', closePanels);

document.getElementById('cartItems').addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
  } else if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    const quantity = (cart.get(id) || 0) + Number(quantityButton.dataset.change);
    if (quantity <= 0) cart.delete(id);
    else cart.set(id, quantity);
  } else return;
  updateCart();
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity() || !cart.size) return;
  const customerName = document.getElementById('customerName').value.trim();
  const payment = new FormData(checkoutForm).get('payment');
  document.getElementById('successText').textContent = `Thanks, ${customerName}. ${payment} is selected. This is a checkout preview only—no order is sent and no payment is taken. Connect a secure store backend and payment provider to accept real purchases.`;
  checkoutForm.hidden = true;
  document.getElementById('orderSuccess').hidden = false;
  cart.clear();
  updateCart();
});

document.getElementById('finishOrder').addEventListener('click', () => {
  closePanels();
  window.location.hash = '#shop';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePanels();
});
document.getElementById('year').textContent = new Date().getFullYear();

renderProducts();
renderProductPage();
updateCart();
