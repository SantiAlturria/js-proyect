// Lista de destinos con precios por día //
const destinos = [
  { nombre: "Bariloche", precioPorDia: 15000 },
  { nombre: "Mendoza", precioPorDia: 12000 },
  { nombre: "Salta", precioPorDia: 10000 }
];

// Captura de elementos del DOM //
const form = document.getElementById("simulador-form");
const resultadoDiv = document.getElementById("resultado");
const reservasDiv = document.getElementById("reservas");

// Cargar reservas previas al iniciar //
document.addEventListener("DOMContentLoaded", mostrarReservasGuardadas);

// Evento de envío del formulario //
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const destinoSeleccionado = document.getElementById("destino").value;
  const dias = parseInt(document.getElementById("dias").value);
  const personas = parseInt(document.getElementById("personas").value);

  // Validación básica 7//
  if (!destinoSeleccionado || dias <= 0 || personas <= 0 || isNaN(dias) || isNaN(personas)) {
    mostrarResultado("Por favor, completá todos los campos correctamente.");
    return;
  }

  const destino = destinos.find(d => d.nombre === destinoSeleccionado);
  const total = calcularCostoTotal(destino.precioPorDia, dias, personas);

  const reserva = {
    destino: destino.nombre,
    dias,
    personas,
    total
  };

  mostrarResultado(`El costo total del viaje a <strong>${reserva.destino}</strong> es de <strong>$${reserva.total.toFixed(2)}</strong> (IVA incluido).`);
  guardarReserva(reserva);
  mostrarReservasGuardadas();
});

// Calcular total con IVA //
function calcularCostoTotal(precioPorDia, dias, personas) {
  const subtotal = precioPorDia * dias * personas;
  const iva = subtotal * 0.21;
  return subtotal + iva;
}

// Mostrar resultado en pantalla //
function mostrarResultado(mensajeHTML) {
  resultadoDiv.innerHTML = `<p>${mensajeHTML}</p>`;
}

// Guardar en localStorage //
function guardarReserva(reserva) {
  const reservas = obtenerReservas();
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

// Obtener reservas desde localStorage //
function obtenerReservas() {
  return JSON.parse(localStorage.getItem("reservas")) || [];
}

// Mostrar reservas guardadas en pantalla //
function mostrarReservasGuardadas() {
  const reservas = obtenerReservas();
  if (reservas.length === 0) {
    reservasDiv.innerHTML = "<p>No hay reservas guardadas aún.</p>";
    return;
  }

  reservasDiv.innerHTML = "";
  reservas.forEach((r, i) => {
    const card = document.createElement("div");
    card.classList.add("reserva-card");
    card.innerHTML = `
      <p><strong>Reserva #${i + 1}</strong></p>
      <p>Destino: ${r.destino}</p>
      <p>Días: ${r.dias}</p>
      <p>Personas: ${r.personas}</p>
      <p>Total: $${r.total.toFixed(2)}</p>
    `;
    reservasDiv.appendChild(card);
  });
}

