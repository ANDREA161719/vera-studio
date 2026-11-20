const WHATSAPP_NUMBER = "573108895061";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
let activeFilter = "Todos";

function whatsappLink(product) {
  const message = `Hola VERA STUDIO, quiero consultar disponibilidad, tallas y precio de ${product.name} (referencia ${product.id}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = products.filter(product => {
    const matchesCategory = activeFilter === "Todos" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.description} ${product.id}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = "";
  if (!visible.length) {
    grid.innerHTML = '<p class="empty-state">No encontramos prendas con esa búsqueda.</p>';
    return;
  }
  visible.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-code">${product.id}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <a class="product-link" href="${whatsappLink(product)}" target="_blank" rel="noopener">CONSULTAR POR WHATSAPP ↗</a>
      </div>`;
    grid.appendChild(card);
  });
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
