// ElectroShop – app.js (versión corregida)
// Sesión con roles, catálogo con stock, render dinámico, carrito con control de stock.

// ---------- Utilidades ----------
function randomPrice(min, max) {
  const n = Math.floor(Math.random() * (max - min + 1) + min);
  return n - (n % 10); // redondeo a decenas
}
function randomStock(min = 10, max = 35) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function formatARS(n) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

// ---------- Sesión (demo con roles) ----------
const SESSION_KEY = "electroshop_session";
// En electroshop.js
const USERS = [
  { email: "cliente@electro.shop",  password: "123456",  role: "buyer"   },
  { email: "manager@electro.shop",  password: "admin123", role: "manager"}
];

let session = loadSession();

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw
      ? JSON.parse(raw)
      : { logged: false, email: null, role: "guest" };
  } catch {
    return { logged: false, email: null, role: "guest" };
  }
}

function saveSession() {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// ---------- Catálogo ----------
const catalog = {
  televisores: [
    {
      id: "tv1",
      name: 'Smart TV 50" 4K',
      desc: "Panel 4K, HDR10, Wi-Fi, control por voz.",
      img: "https://images.unsplash.com/photo-1555618568-9e1712c57df6?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(450000, 800000),
    },
    {
      id: "tv2",
      name: 'Smart TV 65" QLED',
      desc: "Colores intensos, 120Hz, HDMI 2.1.",
      img: "https://images.unsplash.com/photo-1576153192621-7a3be10b24b0?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(800000, 1400000),
    },
    {
      id: "tv3",
      name: 'LED 43" FHD',
      desc: "Ideal para living y dormitorio.",
      img: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(300000, 500000),
    },
    {
      id: "tv4",
      name: 'Smart TV 55" OLED',
      desc: "Negros puros, Dolby Vision/Atmos.",
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(1100000, 1900000),
    },
  ],
  celulares: [
    {
      id: "ph1",
      name: "Smartphone Pro 128GB",
      desc: "Cámara triple, 5G, 6.5\"",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(250000, 600000),
    },
    {
      id: "ph2",
      name: "Smartphone Lite 64GB",
      desc: "Batería 5000mAh, dual SIM.",
      img: "https://images.unsplash.com/photo-1542759564-1750f1eac3b0?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(160000, 300000),
    },
    {
      id: "ph3",
      name: "Smartphone Ultra 256GB",
      desc: "Pantalla 120Hz, carga rápida.",
      img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(400000, 900000),
    },
    {
      id: "ph4",
      name: "Smartphone Compact 128GB",
      desc: "Diseño compacto, gran rendimiento.",
      img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(220000, 420000),
    },
  ],
  tablets: [
    {
      id: "tb1",
      name: 'Tablet 10" 128GB',
      desc: "Ideal para estudiar y ver series.",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(200000, 450000),
    },
    {
      id: "tb2",
      name: 'Tablet 11" Pro',
      desc: "Stylus, 120Hz, teclado opcional.",
      img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(350000, 700000),
    },
    {
      id: "tb3",
      name: 'Tablet 8" 64GB',
      desc: "Compacta, liviana y versátil.",
      img: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(120000, 250000),
    },
  ],
  audio: [
    {
      id: "au1",
      name: "Auriculares BT ANC",
      desc: "Cancelación activa de ruido.",
      img: "https://images.unsplash.com/photo-1518449007433-7db8f5a4f7e8?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(60000, 160000),
    },
    {
      id: "au2",
      name: "Parlante Bluetooth",
      desc: "Resistente al agua, 20W.",
      img: "https://images.unsplash.com/photo-1571668088676-b84baf4df0f4?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(40000, 120000),
    },
    {
      id: "au3",
      name: "Barra de sonido 2.1",
      desc: "Subwoofer, HDMI ARC.",
      img: "https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(150000, 350000),
    },
  ],
  cocina: [
    {
      id: "ck1",
      name: "Microondas 28L",
      desc: "Descongelado y menús automáticos.",
      img: "https://images.unsplash.com/photo-1612152605497-1e3b38a6c5cc?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(90000, 210000),
    },
    {
      id: "ck2",
      name: "Licuadora 1.5L 800W",
      desc: "Vaso de vidrio, 3 velocidades.",
      img: "https://images.unsplash.com/photo-1617760438258-638eb8dcf2a0?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(60000, 120000),
    },
    {
      id: "ck3",
      name: "Cafetera Express",
      desc: "Espresso, cappuccino, vaporizador.",
      img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop",
      price: randomPrice(150000, 350000),
    },
  ],
};

// Asignamos stock inicial aleatorio mínimo 10
Object.values(catalog).flat().forEach((p) => {
  if (typeof p.stock !== "number") p.stock = randomStock(10, 35);
});

// ---------- Fichas técnicas embebidas ----------
const productSpecs = {
  tv1: [
    { label: "Pantalla", value: '50" 4K UHD, HDR10' },
    { label: "Sistema", value: "Smart TV con asistente por voz" },
    { label: "Conectividad", value: "Wi-Fi ac, 3x HDMI, 2x USB" },
  ],
  tv2: [
    { label: "Pantalla", value: '65" QLED, 120Hz' },
    { label: "Procesador", value: "Motor Quantum 4K" },
    { label: "Conectividad", value: "Wi-Fi 6, 4x HDMI 2.1" },
  ],
  // podés seguir agregando el resto
};

function buildSpecSrc(id) {
  const spec =
    productSpecs[id] && productSpecs[id].length
      ? productSpecs[id]
      : [{ label: "Ficha", value: "Datos próximamente" }];

  const rows = spec
    .map(
      (item) =>
        `<tr><th scope="row">${item.label}</th><td>${item.value}</td></tr>`
    )
    .join("");

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8" /><style>
:root{color-scheme:dark;}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#0b1221;color:#e5e7eb;}
table{width:100%;border-collapse:collapse;font-size:12px;line-height:1.4;}
th,td{padding:6px;border-bottom:1px solid #1f2937;text-align:left;}
th{color:#a78bfa;font-weight:600;width:45%;}
tr:last-child th,tr:last-child td{border-bottom:none;}
</style></head><body><table>${rows}</table></body></html>`;

  return `data:text/html;charset=UTF-8,${encodeURIComponent(html)}`;
}

// ---------- Carrito ----------
const CART_KEY = "electroshop_cart";
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount() {
  return Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
}

function cartTotal() {
  return Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
}

// ---------- DOM refs ----------
const track = document.getElementById("carouselTrack");
const prevBtn = document.querySelector(".carousel__nav.prev");
const nextBtn = document.querySelector(".carousel__nav.next");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("searchInput");

const loginModal = document.getElementById("loginModal");
const openLogin = document.getElementById("openLogin");
const ctaLogin = document.getElementById("ctaLogin");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const sessionStatus = document.getElementById("sessionStatus");

const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ---------- Inicialización ----------
document.getElementById("year").textContent = new Date().getFullYear();
let currentCategory = "televisores";

updateSessionUI();
updateCartUI();
renderCarousel(currentCategory);

// ---------- Listeners globales ----------
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.dataset.cat;
    renderCarousel(currentCategory, searchInput.value.trim());
  });
});

searchInput.addEventListener("input", () => {
  renderCarousel(currentCategory, searchInput.value.trim());
});

prevBtn.addEventListener("click", () =>
  track.scrollBy({ left: -300, behavior: "smooth" })
);
nextBtn.addEventListener("click", () =>
  track.scrollBy({ left: 300, behavior: "smooth" })
);

openLogin.addEventListener("click", () => loginModal.showModal());
ctaLogin.addEventListener("click", () => loginModal.showModal());
closeLogin.addEventListener("click", () => loginModal.close());

// Login DEMO con roles
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    session.logged = true;
    session.email = user.email;
    session.role = user.role; // "buyer" o "manager"
    saveSession();
    updateSessionUI();
    loginModal.close();
    alert(
      `👋 ¡Bienvenido ${
        user.role === "manager" ? "Manager" : "Cliente"
      }! Ya podés comprar.`
    );
  } else {
    alert(
      "Credenciales inválidas. Usá demo@electro.shop / 123456 o manager@electro.shop / admin123"
    );
  }
});

logoutBtn.addEventListener("click", () => {
  session = { logged: false, email: null, role: "guest" };
  saveSession();
  updateSessionUI();
});

openCartBtn.addEventListener("click", () =>
  cartDrawer.classList.add("open")
);
closeCartBtn.addEventListener("click", () =>
  cartDrawer.classList.remove("open")
);

checkoutBtn.addEventListener("click", () => {
  if (!session.logged) return;
  if (cartCount() === 0) return;
  alert("✅ Compra realizada. ¡Gracias por elegirnos!");
  cart = {};
  saveCart();
  updateCartUI();
});

// ---------- Render del carrusel ----------
function renderCarousel(cat, term = "") {
  const items = (catalog[cat] || []).filter((p) => {
    const t = term.toLowerCase();
    return (
      p.name.toLowerCase().includes(t) ||
      p.desc.toLowerCase().includes(t)
    );
  });

  track.innerHTML = "";

  for (const p of items) {
    const li = document.createElement("li");

    li.innerHTML = `
<article class="card">
  <img src="${p.img}" alt="${p.name}" class="card__img" loading="lazy" />
  <div class="card__body">
    <h3 class="card__title">${p.name}</h3>
    <p class="card__desc">${p.desc}</p>
    <div class="card__price">${formatARS(p.price)}</div>
    <div class="card__stock">
      Stock: <strong data-stock="${p.id}">${p.stock}</strong> u.
    </div>

    <div class="card__spec">
      <h4 class="card__spec-title">Ficha técnica</h4>
      <iframe
        class="card__frame"
        src="${buildSpecSrc(p.id)}"
        title="Ficha técnica ${p.name}"
        loading="lazy"
      ></iframe>
    </div>

    <div class="actions">
      <button
        class="btn btn-buy"
        data-buy="${p.id}"
        ${!session.logged ? 'disabled title="Iniciá sesión para comprar"' : ""}
      >
        Comprar
      </button>

      <button class="btn btn-sell" data-sell="${p.id}">
        Vender
      </button>

      ${
        session.role === "manager"
          ? `
        <div class="mgr">
          <button class="qty-btn" data-stock-dec="${p.id}" title="Bajar stock">-</button>
          <button class="qty-btn" data-stock-inc="${p.id}" title="Subir stock">+</button>
        </div>`
          : ""
      }
    </div>
  </div>
</article>`;

    track.appendChild(li);
  }

  // Listener de Comprar (respeta stock)
  track.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-buy");
      const product = findProductById(id);
      if (!product) return;

      if (!session.logged) {
        alert("Debés iniciar sesión para comprar.");
        return;
      }

      const currentInCart = cart[id]?.qty || 0;
      if (product.stock <= 0 || currentInCart >= product.stock) {
        alert("Sin stock disponible para este producto.");
        return;
      }

      if (!cart[id]) {
        cart[id] = {
          id,
          title: product.name,
          price: product.price,
          img: product.img,
          qty: 0,
        };
      }
      cart[id].qty += 1;
      product.stock -= 1;

      saveCart();
      updateCartUI();

      // Actualizar contador visual del stock mostrado en la card
      const stockEl = track.querySelector(`[data-stock="${id}"]`);
      if (stockEl) stockEl.textContent = product.stock;

      // animación feedback
      btn.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.07)" },
          { transform: "scale(1)" },
        ],
        { duration: 220 }
      );
    });
  });

  // Listener de Vender (simulado)
  track.querySelectorAll("[data-sell]").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(
        'Función "Vender" simulada: acá podrías abrir un formulario para publicar tu producto.'
      );
    });
  });

  // Controles de stock visibles solo si sos manager
  if (session.role === "manager") {
    track.querySelectorAll("[data-stock-inc]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-stock-inc");
        const product = findProductById(id);
        if (!product) return;
        product.stock += 1;
        const stockEl = track.querySelector(`[data-stock="${id}"]`);
        if (stockEl) stockEl.textContent = product.stock;
      });
    });

    track.querySelectorAll("[data-stock-dec]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-stock-dec");
        const product = findProductById(id);
        if (!product) return;
        if (product.stock <= 0) return;
        product.stock -= 1;

        const stockEl = track.querySelector(`[data-stock="${id}"]`);
        if (stockEl) stockEl.textContent = product.stock;

        // si el carrito tenía más cantidad que el nuevo stock, recortar
        const item = cart[id];
        if (item && item.qty > product.stock) {
          item.qty = product.stock;
          if (item.qty <= 0) {
            delete cart[id];
          }
          saveCart();
          updateCartUI();
        }
      });
    });
  }
}

// ---------- utils de catálogo ----------
function findProductById(id) {
  for (const cat of Object.values(catalog)) {
    const item = cat.find((p) => p.id === id);
    if (item) return item;
  }
  return null;
}

// ---------- UI de sesión / carrito ----------
function updateSessionUI() {
  let label;
  if (!session.logged) {
    label = "Invitado 👀";
  } else if (session.role === "manager") {
    label = `Manager: ${session.email} 🛠️`;
  } else {
    label = `Cliente: ${session.email} 🛒`;
  }

  sessionStatus.textContent = label;

  openLogin.classList.toggle("hidden", session.logged);
  ctaLogin.classList.toggle("hidden", session.logged);
  logoutBtn.classList.toggle("hidden", !session.logged);

  // Re-render: habilita/oculta comprar, muestra +/- stock si sos manager
  renderCarousel(currentCategory, searchInput.value.trim());
}


function updateCartUI() {
  const entries = Object.values(cart);
  cartCountEl.textContent = cartCount();

  if (entries.length === 0) {
    cartItemsEl.classList.add("empty");
    cartItemsEl.innerHTML =
      '<p class="muted">No hay productos en el carrito.</p>';
    cartTotalEl.textContent = "$0";
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsEl.classList.remove("empty");
  cartItemsEl.innerHTML = "";

  for (const item of entries) {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div>
        <p class="cart-item__title">${item.title}</p>
        <p class="cart-item__price">${formatARS(item.price)}</p>
        <div class="cart-item__qty">
          <button class="qty-btn" data-dec="${item.id}" aria-label="Quitar uno">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-inc="${item.id}" aria-label="Agregar uno">+</button>
          <button class="qty-btn" data-del="${item.id}" aria-label="Eliminar">✕</button>
        </div>
      </div>
      <strong>${formatARS(item.price * item.qty)}</strong>
    `;
    cartItemsEl.appendChild(row);
  }

  cartTotalEl.textContent = formatARS(cartTotal());
  checkoutBtn.disabled = !session.logged || cartCount() === 0;

  // +1 con validación de stock disponible
  cartItemsEl
    .querySelectorAll("[data-inc]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.inc;
        const product = findProductById(id);
        if (!product) return;
        const current = cart[id]?.qty || 0;
        if (current >= product.stock) {
          alert("No podés superar el stock disponible.");
          return;
        }
        qty(id, +1);
      })
    );

  // -1
  cartItemsEl
    .querySelectorAll("[data-dec]")
    .forEach((b) =>
      b.addEventListener("click", () => qty(b.dataset.dec, -1))
    );

  // eliminar
  cartItemsEl
    .querySelectorAll("[data-del]")
    .forEach((b) =>
      b.addEventListener("click", () => del(b.dataset.del))
    );
    // +1 con validación y ajuste de stock
cartItemsEl.querySelectorAll("[data-inc]").forEach((b) =>
  b.addEventListener("click", () => {
    const id = b.dataset.inc;
    const product = findProductById(id);
    if (!product) return;
    const current = cart[id]?.qty || 0;

    // si no queda stock, no se puede sumar
    if (product.stock <= 0) {
      alert("No hay más stock disponible.");
      return;
    }

    // sumar y descontar stock
    cart[id].qty = current + 1;
    product.stock -= 1;
    saveCart();
    updateCartUI();

    // actualizar contador visual en la card (si está visible)
    const stockEl = document.querySelector(`[data-stock="${id}"]`);
    if (stockEl) stockEl.textContent = product.stock;
  })
);

// -1 devolviendo stock
cartItemsEl.querySelectorAll("[data-dec]").forEach((b) =>
  b.addEventListener("click", () => {
    const id = b.dataset.dec;
    const product = findProductById(id);
    if (!product || !cart[id]) return;

    cart[id].qty -= 1;
    product.stock += 1; // recupera stock

    if (cart[id].qty <= 0) delete cart[id];

    saveCart();
    updateCartUI();

    const stockEl = document.querySelector(`[data-stock="${id}"]`);
    if (stockEl) stockEl.textContent = product.stock;
  })
);

}

function qty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  saveCart();
  updateCartUI();
}

function del(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}
