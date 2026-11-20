const WHATSAPP_NUMBER = "573108895061";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const kidsSubfilters = document.getElementById("kidsSubfilters");
let activeFilter = "Todos";
let activeKidFilter = "Todos";
let cart = [];

function whatsappLink(product) {
  const message = `Hola VERA STUDIO, quiero consultar disponibilidad, tallas y precio de ${product.name} (referencia ${product.id}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function selectCollection(category) {
  activeFilter = category;
  activeKidFilter = "Todos";
  document.querySelectorAll("#filters [data-filter]").forEach(button => button.classList.toggle("active", button.dataset.filter === category));
  kidsSubfilters.hidden = category !== "Infantil";
  kidsSubfilters.querySelectorAll("[data-kid-filter]").forEach(button => button.classList.toggle("active", button.dataset.kidFilter === "Todos"));
  renderProducts();
}
function carouselPageSize() {
  return window.matchMedia("(max-width: 600px)").matches ? 1 : window.matchMedia("(max-width: 900px)").matches ? 2 : 3;
}
function updateCarouselControls() {
  const dots = document.getElementById("carouselDots");
  const cards = [...grid.querySelectorAll(".product-card")];
  dots.innerHTML = "";
  const perPage = carouselPageSize();
  const pages = Math.ceil(cards.length / perPage);
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Ir a la página " + (i + 1));
    dot.addEventListener("click", () => {
      const target = cards[i * perPage];
      if (target) grid.scrollTo({ left: target.offsetLeft - grid.offsetLeft, behavior: "smooth" });
    });
    dots.appendChild(dot);
  }
  const canScroll = grid.scrollWidth > grid.clientWidth + 4;
  document.getElementById("productsPrev").disabled = !canScroll;
  document.getElementById("productsNext").disabled = !canScroll;
}
function refreshCarouselPosition() {
  const cards = [...grid.querySelectorAll(".product-card")];
  const perPage = carouselPageSize();
  if (!cards.length) return;
  const page = Math.min(Math.round(grid.scrollLeft / Math.max(1, cards[0].offsetWidth * perPage)), Math.ceil(cards.length / perPage) - 1);
  [...document.querySelectorAll("#carouselDots .carousel-dot")].forEach((dot, index) => dot.classList.toggle("active", index === page));
  document.getElementById("productsPrev").disabled = grid.scrollLeft <= 4;
  document.getElementById("productsNext").disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
}
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = products.filter(product => {
    const matchesCategory = activeFilter === "Todos" || product.category === activeFilter;
    const matchesKid = activeFilter !== "Infantil" || activeKidFilter === "Todos" || product.subcategory === activeKidFilter;
    const matchesSearch = `${product.name} ${product.description} ${product.id}`.toLowerCase().includes(query);
    return matchesCategory && matchesKid && matchesSearch;
  });
  grid.innerHTML = "";
  if (!visible.length) {
    const message = activeFilter === "Hombre" ? "Estamos preparando la colección VERA HOMBRE. Muy pronto encontrarás aquí nuestras prendas." : activeFilter === "Infantil" ? "Estamos preparando VERA INFANTIL. Pronto encontrarás prendas para niño y niña." : "No encontramos prendas con esa búsqueda. Prueba con otra palabra.";
    grid.innerHTML = `<div class="empty-collection"><span class="empty-monogram">VS</span><h3>${activeFilter === "Hombre" ? "VERA HOMBRE" : activeFilter === "Infantil" ? "VERA INFANTIL" : "SIN RESULTADOS"}</h3><p>${message}</p><a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola VERA STUDIO, quisiera conocer las próximas novedades.")}" target="_blank" rel="noopener">Consultar novedades por WhatsApp ↗</a></div>`;
    updateCarouselControls();
    return;
  }
  visible.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `<div class="product-photo"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-code">${product.id}</span></div><div class="product-info"><h3>${product.name}</h3><p>${product.description}</p><p class="product-price">Precio por confirmar</p><div class="product-actions"><button class="add-cart" data-add="${product.id}">AGREGAR A MI BOLSA +</button><a class="product-link" href="${whatsappLink(product)}" target="_blank" rel="noopener">CONSULTAR ↗</a></div></div>`;
    grid.appendChild(card);
  });
  updateCarouselControls();
}
function renderCart() {
  document.getElementById("cartCount").textContent = cart.reduce((sum,item) => sum + item.quantity, 0);
  const area = document.getElementById("cartItems");
  if (!cart.length) { area.innerHTML = '<p class="cart-empty">Tu bolsa está vacía.</p>'; return; }
  area.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `<article class="cart-item"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><small>Ref. ${product.id} · Talla por confirmar</small><div class="quantity-controls"><button data-qty="${item.id}" data-change="-1" aria-label="Quitar">−</button><span>${item.quantity}</span><button data-qty="${item.id}" data-change="1" aria-label="Agregar">+</button><button class="remove-item" data-remove="${item.id}">Eliminar</button></div></div><b>Precio pendiente</b></article>`;
  }).join("");
}
function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("cartBackdrop").classList.add("visible");
  document.getElementById("cartPanel").setAttribute("aria-hidden","false");
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("visible");
  document.getElementById("cartPanel").setAttribute("aria-hidden","true");
}
document.getElementById("productsPrev").addEventListener("click", () => {
  grid.scrollBy({ left: -grid.clientWidth, behavior: "smooth" });
});
document.getElementById("productsNext").addEventListener("click", () => {
  grid.scrollBy({ left: grid.clientWidth, behavior: "smooth" });
});
grid.addEventListener("scroll", refreshCarouselPosition, { passive: true });
window.addEventListener("resize", () => {
  updateCarouselControls();
  refreshCarouselPosition();
});
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (button) selectCollection(button.dataset.filter);
});
kidsSubfilters.addEventListener("click", event => {
  const button = event.target.closest("[data-kid-filter]");
  if (!button) return;
  activeKidFilter = button.dataset.kidFilter;
  kidsSubfilters.querySelectorAll("[data-kid-filter]").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
document.querySelectorAll("[data-collection]").forEach(card => card.addEventListener("click", () => selectCollection(card.dataset.collection)));
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity++; else cart.push({id,quantity:1});
  renderCart(); openCart();
});
document.getElementById("cartItems").addEventListener("click", event => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  if (remove) cart = cart.filter(item => item.id !== remove.dataset.remove);
  if (qty) {
    const item = cart.find(entry => entry.id === qty.dataset.qty);
    item.quantity += Number(qty.dataset.change);
    if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== qty.dataset.qty);
  }
  renderCart();
});
document.getElementById("sendOrder").addEventListener("click", () => {
  if (!cart.length) return;
  const lines = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `• ${product.name} (${product.id}) x ${item.quantity}`;
  }).join("\n");
  const message = `Hola VERA STUDIO, quiero consultar este pedido:\n${lines}\nPor favor confirmen precios, tallas y disponibilidad.\nCiudad: `;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartBackdrop").addEventListener("click",closeCart);
searchInput.addEventListener("input",renderProducts);
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts(); renderCart();
