// Admin Dashboard
// - Métricas simuladas
// - Chart de ventas últimos 7 días
// - Tabla filtrable de usuarios
// Esto demuestra: dashboard interno, filtros dinámicos, visualización de datos en tiempo real en front.

document.getElementById("year").textContent = new Date().getFullYear();

/* ------- Datos "fake" (simulación de backend) ------- */
const metrics = {
  ventasHoy: 1523000, // ARS
  deltaVsAyer: +12,   // %
  activos24h: 128,
  ticketsAbiertos: 5,
};

const ventas7dias = [
  { dia: "Lun", total: 900000 },
  { dia: "Mar", total: 1100000 },
  { dia: "Mié", total: 1050000 },
  { dia: "Jue", total: 1300000 },
  { dia: "Vie", total: 1500000 },
  { dia: "Sáb", total: 1800000 },
  { dia: "Dom", total: 1200000 },
];

// Usuarios "del sistema"
const users = [
  { nombre: "Ana Riquelme",    rol: "admin",   estado: "activo" },
  { nombre: "Diego Salvatierra", rol: "manager", estado: "activo" },
  { nombre: "Paula Urquiza",   rol: "user",    estado: "pendiente" },
  { nombre: "Martín Torres",   rol: "user",    estado: "activo" },
  { nombre: "Laura Acosta",    rol: "manager", estado: "suspendido" },
  { nombre: "Julián Cuello",   rol: "user",    estado: "activo" },
];

/* ------- Helpers ------- */
function formatARS(n){
  return n.toLocaleString("es-AR",{
    style:"currency",
    currency:"ARS",
    maximumFractionDigits:0
  });
}

/* ------- Pintar métricas ------- */
const mVentasHoy   = document.getElementById("mVentasHoy");
const mVentasDelta = document.getElementById("mVentasDelta");
const mActivos     = document.getElementById("mActivos");
const mTickets     = document.getElementById("mTickets");

mVentasHoy.textContent   = formatARS(metrics.ventasHoy);
mVentasDelta.textContent = `${metrics.deltaVsAyer >= 0 ? "+" : ""}${metrics.deltaVsAyer}% vs ayer`;
mActivos.textContent     = metrics.activos24h;
mTickets.textContent     = metrics.ticketsAbiertos;

/* ------- Chart de ventas (Chart.js) ------- */
const ctx = document.getElementById("salesChart").getContext("2d");

// Notas: Chart.js requiere un objeto con labels y datasets.
// Elegimos línea suave que se vea tipo dashboard moderno.
new Chart(ctx, {
  type: "line",
  data: {
    labels: ventas7dias.map(v => v.dia),
    datasets: [
      {
        label: "Ventas ARS",
        data: ventas7dias.map(v => v.total),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,.15)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
      },
    ],
  },
  options: {
    scales: {
      y: {
        ticks: {
          callback: (val) => formatARS(val),
          color: "#9ca3af"
        },
        grid: { color: "rgba(148,163,184,.15)" }
      },
      x: {
        ticks: { color: "#9ca3af" },
        grid: { display:false }
      }
    },
    plugins: {
      legend: { display:false },
      tooltip: {
        callbacks:{
          label: (ctx)=> ` ${formatARS(ctx.raw)}`
        }
      }
    }
  }
});

/* ------- Tabla de usuarios con filtro ------- */
const userTableBody = document.getElementById("userTableBody");
const filterText    = document.getElementById("filterText");
const filterRole    = document.getElementById("filterRole");

renderUsers();

// cada vez que filtro, repinto tabla
filterText.addEventListener("input", renderUsers);
filterRole.addEventListener("change", renderUsers);

function renderUsers(){
  const text = filterText.value.toLowerCase().trim();
  const role = filterRole.value;

  const filtered = users.filter(u => {
    const matchText = u.nombre.toLowerCase().includes(text);
    const matchRole = role === "" || u.rol === role;
    return matchText && matchRole;
  });

  userTableBody.innerHTML = "";

  filtered.forEach(u => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.nombre}</td>
      <td><span class="badge-role ${u.rol}">${u.rol}</span></td>
      <td>${u.estado}</td>
    `;

    userTableBody.appendChild(tr);
  });
}

/* ------- Branding footer year ------- */
document.getElementById("year").textContent = new Date().getFullYear();
