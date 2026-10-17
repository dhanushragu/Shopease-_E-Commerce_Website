const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const emptyState = $("#emptyState");
const searchInput = $("#searchInput");
const categoryFilter = $("#categoryFilter");
const sortFilter = $("#sortFilter");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const toast = $("#toast");

let activeCategory = "All";
let searchTerm = "";
let cart = [];

const money = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);

function getVisibleProducts() {
  let list = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
  if (sortFilter.value === "low") list.sort((a,b) => a.price - b.price);
  if (sortFilter.value === "high") list.sort((a,b) => b.price - a.price);
  if (sortFilter.value === "rating") list.sort((a,b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  const list = getVisibleProducts();
  productGrid.innerHTML = list.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x700/f0eee7/45483c?text=ShopEase'">
        <span class="product-badge">${product.badge}</span>
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to cart" title="Add to cart">+</button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 title="${product.name}">${product.name}</h3>
        <div class="product-meta">
          <div><span class="price">${money(product.price)}</span><span class="old-price">${money(product.oldPrice)}</span></div>
          <span class="rating"><span>★</span> ${product.rating}</span>
        </div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("hidden", list.length > 0);
  productGrid.classList.toggle("hidden", list.length === 0);
}

function setCategory(category) {
  activeCategory = category;
  categoryFilter.value = category;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });
  document.querySelectorAll(".main-nav [data-category]").forEach((link) => {
    link.classList.toggle("active", link.dataset.category === category);
  });
  renderProducts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function addToCart(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity:1});
  renderCart();
  showToast(`${product.name} added to your cart`);
}

function changeQuantity(id, amount) {
  const item = cart.find((product) => product.id === Number(id));
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((product) => product.id !== Number(id));
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== Number(id));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartItems").innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x170/f0eee7/45483c?text=Item'">
      <div><h4>${item.name}</h4><small>${money(item.price)} each</small>
        <div class="quantity-controls">
          <button data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" data-remove="${item.id}">Remove</button>
      </div>
      <span class="cart-item-price">${money(item.price * item.quantity)}</span>
    </div>`).join("");
  $("#cartEmpty").classList.toggle("hidden", count > 0);
  $("#cartSummary").classList.toggle("hidden", count === 0);
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#closeCart").focus();
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});
$("#cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});
$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    $("#accountModal").classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value;
  renderProducts();
  $("#products").scrollIntoView({behavior:"smooth"});
});
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderProducts();
});
categoryFilter.addEventListener("change", () => setCategory(categoryFilter.value));
sortFilter.addEventListener("change", renderProducts);
$("#categoryChips").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-category]");
  if (chip) setCategory(chip.dataset.category);
});
document.querySelectorAll(".main-nav [data-category]").forEach((link) => {
  link.addEventListener("click", () => setCategory(link.dataset.category));
});
$("#resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  sortFilter.value = "featured";
  setCategory("All");
});

$("#accountButton").addEventListener("click", () => {
  $("#accountModal").classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});
function closeAccount() {
  $("#accountModal").classList.add("hidden");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}
$("#closeAccount").addEventListener("click", closeAccount);
$("#accountOkay").addEventListener("click", closeAccount);
$("#checkoutButton").addEventListener("click", () => {
  showToast("Demo checkout only — backend and payment are not connected.");
});

$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#emailInput").value.trim();
  if (!email) return;
  $("#newsletterMessage").textContent = "Thanks for joining! This demo doesn't save email addresses.";
  $("#newsletterMessage").style.color = "#526c2c";
  $("#emailInput").value = "";
  showToast("Thanks for joining ShopEase!");
});
$("#backToTop").addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({top:0,behavior:"smooth"});
});

renderProducts();
renderCart();
