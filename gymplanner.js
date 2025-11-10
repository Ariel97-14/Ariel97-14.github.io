// GymPlanner
// Lógica de reservas con cupos y persistencia local (localStorage)

const STORAGE_KEY = "gymplanner_bookings_v1";

// Clases disponibles en la semana (esto sería data del backend en la vida real)
const classesData = [
  // Cada clase = un horario
  { id: "c1", dia: "Lunes",    nombre: "Funcional",   hora: "18:00", cupoMax: 10, cupoUsado: 3 },
  { id: "c2", dia: "Lunes",    nombre: "HIIT",        hora: "19:00", cupoMax: 8,  cupoUsado: 7 },
  { id: "c3", dia: "Martes",   nombre: "CrossFit",    hora: "18:30", cupoMax: 12, cupoUsado: 12 },
  { id: "c4", dia: "Miércoles",nombre: "Boxeo",       hora: "20:00", cupoMax: 10, cupoUsado: 1 },
  { id: "c5", dia: "Jueves",   nombre: "Funcional",   hora: "18:00", cupoMax: 10, cupoUsado: 6 },
  { id: "c6", dia: "Viernes",  nombre: "Stretch & Core", hora: "19:30", cupoMax: 15, cupoUsado: 4 },
];

// bookings = array de ids reservados por "vos"
let bookings = loadBookings();
// Clon base para poder recomputar cupos cuando haga falta
const baseClasses = JSON.parse(JSON.stringify(classesData));

function resetToBase() {
  classesData.forEach((c, i) => Object.assign(c, baseClasses[i]));
}

function applyUserBookings() {
  bookings.forEach(id => {
    const cls = classesData.find(c => c.id === id);
    if (cls) cls.cupoUsado = Math.min(cls.cupoUsado + 1, cls.cupoMax);
  });
}
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    try { bookings = JSON.parse(e.newValue || "[]"); } catch { bookings = []; }
    resetToBase();
    applyUserBookings();
    renderSchedule();
    renderMyBookings();
  }
});

const tbody = document.getElementById("scheduleBody");
const myBookingsEl = document.getElementById("myBookings");

document.getElementById("year").textContent = new Date().getFullYear();

renderSchedule();
renderMyBookings();

/* -------------------------
   Render tabla principal
------------------------- */
function renderSchedule() {
  tbody.innerHTML = "";

  classesData.forEach(cls => {
    const disponible = cls.cupoMax - cls.cupoUsado;
    const yaReservado = bookings.includes(cls.id);

    const tr = document.createElement("tr");

    // badge de cupo
    const badgeClass =
      disponible <= 0
        ? "full"
        : disponible <= 2
        ? "low"
        : "ok";

    tr.innerHTML = `
      <td>${cls.dia}</td>
      <td>${cls.nombre}</td>
      <td>${cls.hora}</td>
      <td>
        <span class="badge ${badgeClass}">
          ${disponible > 0 ? `${disponible} libres` : "COMPLETO"}
        </span>
      </td>
      <td>
        ${
          yaReservado
            ? `<button class="btn btn-cancel" data-cancel="${cls.id}">Cancelar</button>`
            : `<button class="btn btn-reserve" data-reserve="${cls.id}" ${
                disponible <= 0 ? "disabled" : ""
              }>Reservar</button>`
        }
      </td>
    `;

    tbody.appendChild(tr);
  });

  // listeners reservar
  tbody.querySelectorAll("[data-reserve]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-reserve");
      reserveClass(id);
    });
  });

  // listeners cancelar
  tbody.querySelectorAll("[data-cancel]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cancel");
      cancelClass(id);
    });
  });
}
tbody.querySelectorAll("[data-reserve]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-reserve");
    reserveClass(id);
    btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:220});
  });
});

tbody.querySelectorAll("[data-cancel]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-cancel");
    cancelClass(id);
    btn.animate([{opacity:1},{opacity:.6},{opacity:1}],{duration:220});
  });
});

/* -------------------------
   Render panel "Mis Reservas"
------------------------- */
function renderMyBookings() {
  const mine = classesData.filter(cls => bookings.includes(cls.id));

  if (mine.length === 0) {
    myBookingsEl.classList.add("empty");
    myBookingsEl.innerHTML = `<p class="muted center">Todavía no tenés reservas 😴</p>`;
    return;
  }

  myBookingsEl.classList.remove("empty");
  myBookingsEl.innerHTML = "";

  mine.forEach(cls => {
    const card = document.createElement("div");
    card.className = "booking-card";

    card.innerHTML = `
      <div class="booking-head">
        <p class="booking-title">${cls.nombre}</p>
        <button class="btn btn-cancel" data-cancel="${cls.id}">Cancelar</button>
      </div>

      <div class="booking-meta">
        <div>${cls.dia} · ${cls.hora}</div>
        <div>Cupo reservado ✔️</div>
      </div>
    `;

    myBookingsEl.appendChild(card);
  });

  // permitir cancelar desde panel lateral también
  myBookingsEl.querySelectorAll("[data-cancel]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cancel");
      cancelClass(id);
    });
  });
}

/* -------------------------
   Lógica negocio
------------------------- */
function reserveClass(id) {
  // si ya la tengo, no la agrego otra vez
  if (bookings.includes(id)) {
    alert("Ya tenés ese turno reservado 💪");
    return;
  }

  // buscar la clase
  const cls = classesData.find(c => c.id === id);
  if (!cls) return;

  const disponible = cls.cupoMax - cls.cupoUsado;
  if (disponible <= 0) {
    alert("No quedan cupos 😔");
    return;
  }

  // "reservo": sumo mi booking y decremento cupoUsado
  bookings.push(id);
  cls.cupoUsado += 1;

  saveBookings();
  renderSchedule();
  renderMyBookings();
}

function cancelClass(id) {
  if (!bookings.includes(id)) return;

  const cls = classesData.find(c => c.id === id);
  if (cls) {
    // libero cupo
    cls.cupoUsado = Math.max(cls.cupoUsado - 1, 0);
  }

  bookings = bookings.filter(b => b !== id);

  saveBookings();
  renderSchedule();
  renderMyBookings();
}

/* -------------------------
   Persistencia local
------------------------- */
function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveBookings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}
