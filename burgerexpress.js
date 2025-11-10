// BurgerExpress demo
// Features: carta de combos, carrito local (sin login), validación de formulario de pedido.

// Utilidades
function formatARS(n) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}
// Al inicio
const savedCart = JSON.parse(localStorage.getItem("burgerCart") || "{}");
cart = savedCart;
renderOrder();

// Al actualizar el carrito
localStorage.setItem("burgerCart", JSON.stringify(cart));

// "Base de datos" local
const menuData = [
  {
    id: "cb1",
    name: "Combo Clásico",
    desc: "Hamburguesa simple + papas + gaseosa",
    price: 5200,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "cb2",
    name: "Combo Doble Queso",
    desc: "Doble carne, doble cheddar, papas grandes",
    price: 6500,
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "cb3",
    name: "Pollo Crispy Box",
    desc: "Sandwich crispy, papas rústicas, dip picante",
    price: 6100,
    img: "https://images.unsplash.com/photo-1606755962773-d324d9dbb42d?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "cb4",
    name: "Veggie Verde",
    desc: "Burger de garbanzo, palta, tomate asado 🍃",
    price: 5800,
    img: "https://images.unsplash.com/photo-1618213837799-040b6436b7dd?q=80&w=600&auto=format&fit=crop"
  }
];

// estado del carrito en memoria
let cart = {}; // { cb1: { id, name, price, qty } }

// refs DOM
const orderPanel = document.querySelector(".order-panel");
const productList = document.getElementById("productList"); // UL del menú
const orderItems = document.getElementById("orderItems");   // div listado pedido
const orderTotal = document.getElementById("orderTotal");   // total $
const checkoutForm = document.getElementById("checkoutForm");
const nombreInput = document.getElementById("nombre");
const direccionInput = document.getElementById("direccion");
const pagoSelect = document.getElementById("pago");

document.getElementById("year").textContent = new Date().getFullYear();

// render inicial
renderMenu();
renderOrder();

// ---------- Render del menú ----------
function renderMenu() {
  productList.innerHTML = "";

  menuData.forEach(prod => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
      <img class="card__img" src="${prod.img}" alt="${prod.name}" />
      <div class="card__body">
        <div class="card__title">
          <span>${prod.name}</span>
          <span class="card__price">${formatARS(prod.price)}</span>
        </div>
        <p class="card__desc">${prod.desc}</p>

        <div class="card__actions">
          <button class="btn btn--accent" data-add="${prod.id}">Agregar 🍟</button>
          <button class="btn btn--danger" data-remove="${prod.id}">Quitar</button>
        </div>
      </div>
    `;

    productList.appendChild(li);
  });

productList.querySelectorAll("[data-add]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-add");
    addToCart(id);

    // animación del botón (bump)
    btn.classList.remove("bump");
    void btn.offsetWidth; // truco para reiniciar animación
    btn.classList.add("bump");

    // flash panel derecho
    orderPanel.classList.remove("flash");
    void orderPanel.offsetWidth;
    orderPanel.classList.add("flash");
  });
});


  productList.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      removeFromCart(id);
    });
  });
}

// ---------- Carrito ----------
function addToCart(id) {
  const prod = menuData.find(p => p.id === id);
  if (!prod) return;
  if (!cart[id]) {
    cart[id] = { id, name: prod.name, price: prod.price, qty: 0 };
  }
  cart[id].qty += 1;
  renderOrder();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id].qty -= 1;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  renderOrder();
}

function deleteFromCart(id) {
  delete cart[id];
  renderOrder();
}

function cartTotalCalc() {
  return Object.values(cart).reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
}

// ---------- Render del pedido ----------
function renderOrder() {
  const entries = Object.values(cart);

  if (entries.length === 0) {
    orderItems.classList.add("empty");
    orderItems.innerHTML = `<p class="muted center">Todavía no agregaste nada 🍟</p>`;
  } else {
    orderItems.classList.remove("empty");
    orderItems.innerHTML = "";
    entries.forEach(item => {
      const line = document.createElement("div");
      line.className = "line-item";

      line.innerHTML = `
        <div class="line-item__qtybox">
          <button class="qty-btn" data-dec="${item.id}">-</button>
          <div>${item.qty}</div>
          <button class="qty-btn" data-inc="${item.id}">+</button>
        </div>

        <div>
          <p class="line-item__title">${item.name}</p>
          <p class="line-item__price">${formatARS(item.price)}</p>
          <div class="line-item__remove" data-del="${item.id}">Eliminar</div>
        </div>

        <strong>${formatARS(item.qty * item.price)}</strong>
      `;

      orderItems.appendChild(line);
    });

    // listeners carrito dentro del panel derecho
    orderItems.querySelectorAll("[data-inc]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-inc");
        addToCart(id);
      });
    });
    orderItems.querySelectorAll("[data-dec]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-dec");
        removeFromCart(id);
      });
    });
    orderItems.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del");
        deleteFromCart(id);
      });
    });
  }

  orderTotal.textContent = formatARS(cartTotalCalc());
}

// ---------- Validación del checkout ----------
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // limpiamos mensajes viejos
  clearErrors();

  const nombre = nombreInput.value.trim();
  const direccion = direccionInput.value.trim();
  const pago = pagoSelect.value;

  let valid = true;

  if (nombre.length < 4) {
    showError("nombre", "Poné tu nombre completo 😉");
    valid = false;
  }
  if (direccion.length < 5) {
    showError("direccion", "Necesitamos una dirección válida.");
    valid = false;
  }
  if (!pago) {
    showError("pago", "Elegí un método de pago.");
    valid = false;
  }

  if (Object.keys(cart).length === 0) {
    alert("Tu carrito está vacío 🍔 Agregá algo antes de confirmar.");
    valid = false;
  }

  if (!valid) return;

  // si pasó todo:
// si pasó todo:
alert(
  `✅ Pedido confirmado!\n` +
  `Nombre: ${nombre}\n` +
  `Dirección: ${direccion}\n` +
  `Pago: ${pago}\n` +
  `Total: ${orderTotal.textContent}\n\n` +
  `Gracias por comprar en BurgerExpress 🍔🔥`
);

// reseteamos carrito y form
cart = {};
renderOrder();
checkoutForm.reset();

// feedback visual tipo "success"
orderPanel.classList.remove("flash");
void orderPanel.offsetWidth;
orderPanel.classList.add("flash");
orderPanel.style.boxShadow = "0 0 30px rgba(34,197,94,.6)";
setTimeout(() => {
  orderPanel.style.boxShadow = "";
}, 800);
});

// helpers error ui
function showError(fieldId, msg) {
  const small = document.querySelector(`[data-err-for="${fieldId}"]`);
  const inputEl = document.getElementById(fieldId);
  if (small) {
    small.textContent = msg;
    small.style.visibility = "visible";
  }
  if (inputEl) {
    inputEl.classList.add("field-error");
  }
}

function clearErrors() {
  document.querySelectorAll(".err").forEach(s => {
    s.textContent = "";
    s.style.visibility = "hidden";
  });
  document.querySelectorAll(".field-error").forEach(i => {
    i.classList.remove("field-error");
  });
}
