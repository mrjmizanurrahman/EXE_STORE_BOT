const proxyProviders = ['ABC Proxy', 'Rapid Proxy', 'CLI Proxy-Sub', '711 Proxy-Sub'];
const proxyDurations = ['3 Days', '7 Days', '30 Days'];
const vpnPackages = [
  ['3 Days', ['Express VPN', 'CyberGhost VPN', 'Vypr VPN', 'Panda VPN']],
  ['7 Days', ['NORD VPN', 'PIA VPN', 'Hotspot Shield VPN', 'HMA VPN', 'Turbo VPN', 'Surfshark VPN', 'IPVanish VPN', 'Avast VPN', 'Pure VPN', 'Bitdefender VPN', 'Sky VPN', 'X-VPN', 'Potato VPN']],
  ['30 Days', ['Nord VPN', 'Express VPN', 'Proton VPN']]
];
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const products = [
  ...proxyProviders.flatMap((name) => proxyDurations.map((validity) => ({
    id: `proxy-${slugify(name)}-${slugify(validity)}`, name, category: 'Proxy', validity,
    icon: '⌁', tag: validity.toUpperCase(), price: null,
    description: `${name} proxy subscription for ${validity.toLowerCase()}.`
  }))),
  ...vpnPackages.flatMap(([validity, names]) => names.map((name) => ({
    id: `vpn-${slugify(name)}-${slugify(validity)}`, name, category: 'VPN', validity,
    icon: '◉', tag: validity.toUpperCase(), price: null,
    description: `${name} subscription for ${validity.toLowerCase()}.`
  }))),
  { id: 'hotmail-12m-36m', name: 'Hotmail (12M–36M)', category: 'Email', icon: '✉', tag: 'HOTMAIL', price: 0.97, unit: '/ piece', stock: 340, description: 'Hotmail account, 12M–36M option.' },
  { id: 'outlook-12m-36m', name: 'Outlook (12M–36M)', category: 'Email', icon: '✉', tag: 'OUTLOOK', price: 0.85, unit: '/ piece', stock: 1046, description: 'Outlook account, 12M–36M option.' },
  { id: 'outlook-fr-new', name: 'Outlook.fr (New)', category: 'Email', icon: '✉', tag: 'NEW', price: 0.90, unit: '/ piece', stock: 464, description: 'New Outlook.fr account.' },
  { id: 'meta-ai-id', name: 'META AI ID', category: 'AI', icon: '✳', tag: 'META AI', price: 0.80, unit: '/ piece', stock: 5577, description: 'META AI account ID.' },
  { id: '2fa-key', name: '2FA Key', category: 'Security', icon: '⚿', tag: '2FA', price: null, description: 'Two-factor authentication key service.' },
  { id: 'mail-otp', name: 'Mail OTP', category: 'Security', icon: '✉', tag: 'OTP', price: null, description: 'Email one-time passcode service.' },
  { id: 'wallet-recharge', name: 'Add Money', category: 'Account tools', icon: '＋', tag: 'BOT FEATURE', feature: true, description: 'Wallet recharge feature.' },
  { id: 'account-profile', name: 'Profile', category: 'Account tools', icon: '◉', tag: 'BOT FEATURE', feature: true, description: 'View account information and balance.' }
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
  return price == null ? 'Price on request' : `Tk ${price.toFixed(2)}`;
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
        ${product.stock !== undefined ? `<span class="stock-note">Stock: ${product.stock} pcs</span>` : ''}
        <div class="product-bottom"><span class="price ${product.price == null && !product.feature ? 'price-quote' : ''}">${product.feature ? 'Bot feature' : `${formatPrice(product.price)} ${product.unit ? `<small>${product.unit}</small>` : ''}`}</span>${product.feature ? '<span class="feature-label">Account tool</span>' : `<button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button>`}</div>
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
        <div class="detail-price">${product.feature ? 'Bot feature' : `${formatPrice(product.price)} <small>${product.unit || ''}</small>`}</div>
        <p class="detail-note">${product.validity ? `Validity: ${product.validity} · ` : ''}${product.stock !== undefined ? `Stock: ${product.stock} pcs · ` : ''}${product.feature ? 'Account tool' : 'Order details confirmed at checkout'}</p>
        ${product.feature ? '<p class="feature-description">This is an account feature, not a purchasable product.</p>' : `<div class="detail-actions"><button class="primary-link" data-detail-add="${product.id}">Add to cart</button><button class="checkout-button" data-buy-now="${product.id}">Buy now <span>→</span></button></div><div class="detail-payments"><strong>Payment options at checkout</strong><span>bKash · Nagad · Upay · Binance Pay</span></div>`}
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function updateCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const hasQuoteItems = entries.some(([id]) => products.find((product) => product.id === id).price == null);
  const total = entries.reduce((sum, [id, quantity]) => {
    const price = products.find((product) => product.id === id).price;
    return sum + (price == null ? 0 : price * quantity);
  }, 0);
  const totalLabel = hasQuoteItems ? 'Quote required' : formatPrice(total);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('drawerCount').textContent = `(${count})`;
  document.getElementById('cartTotal').textContent = totalLabel;
  document.getElementById('checkoutTotal').textContent = totalLabel;
  cartEmpty.hidden = count > 0;
  cartSummary.hidden = count === 0;
  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    const lineTotal = product.price == null ? 'Quote' : formatPrice(product.price * quantity);
    return `<div class="cart-line"><span class="cart-thumb" aria-hidden="true">${product.icon}</span><div><strong>${product.name}</strong><small>${formatPrice(product.price)}${product.unit ? ` · ${product.unit}` : ' each'}</small><div class="quantity-control"><button data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button><button class="remove-item" data-remove="${id}">Remove</button></div></div><span class="cart-line-total">${lineTotal}</span></div>`;
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
