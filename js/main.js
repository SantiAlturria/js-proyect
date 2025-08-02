// Lista de destinos con precios por día //
const destinos = [
  { nombre: "Bariloche", precioPorDia: 15000 },
  { nombre: "Mendoza", precioPorDia: 12000 },
  { nombre: "Salta", precioPorDia: 10000 }
];

// Captura de elementos del DOM //
const formulariSimulador = document.getElementById("simulador-form");
const contenedorResultado = document.getElementById("resultado");
const contenedorReservas = document.getElementById("reservas");

// Cargar reservas previas al iniciar //
document.addEventListener("DOMContentLoaded", mostrarReservasGuardadas);

// Evento de envío del formulario //
formulariSimulador.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const destinoSeleccionado = document.getElementById("destino").value;
  const cantidadDias = parseInt(document.getElementById("dias").value);
  const cantidadPersonas = parseInt(document.getElementById("personas").value);

  // Validación básica //
  if (!destinoSeleccionado || cantidadDias <= 0 || cantidadPersonas <= 0 || isNaN(cantidadDias) || isNaN(cantidadPersonas)) {
    mostrarResultado("Por favor, completá todos los campos correctamente.");
    return;
  }

  const destinoEncontrado = destinos.find(destinoDisponible => destinoDisponible.nombre === destinoSeleccionado);
  const totalCalculo = calcularCostoTotal(destinoEncontrado.precioPorDia, cantidadDias, cantidadPersonas);

  const reserva = {
    destino: destinoEncontrado.nombre,
    dias: cantidadDias,
    personas: cantidadPersonas,
    total: totalCalculo 
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
  contenedorResultado.push(reserva);
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
    contenedorReservas.innerHTML = "<p>No hay reservas guardadas aún.</p>";
    return;
  }

  
  contenedorReservas.innerHTML = "";
  reservas.forEach((reserva, indiceReserva) => {
    const tarjetaReserva = document.createElement("div");
    tarjetaReserva.classList.add("reserva-card");
    tarjetaReserva.innerHTML = `
      <p><strong>Reserva #${indiceReserva + 1}</strong></p>
      <p>Destino: ${reserva.destino}</p>
      <p>Días: ${reserva.dias}</p>
      <p>Personas: ${reserva.personas}</p>
      <p>Total: $${reserva.total.toFixed(2)}</p>
    `;
    contenedorReservas.appendChild(card);
  });
}

