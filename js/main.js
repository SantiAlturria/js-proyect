// Lista de destinos con precios por día //
const destinos = [
  { nombre: "Bariloche", precioPorDia: 15000 },
  { nombre: "Mendoza", precioPorDia: 12000 },
  { nombre: "Salta", precioPorDia: 10000 }
];

// Captura de elementos del DOM //
const formularioSimulador = document.getElementById("simulador-form");
const contenedorResultado = document.getElementById("resultado");
const btnCheckout = document.getElementById("btnCheckout");
const contenedorReservas = document.getElementById("reservas");
const botonVaciarTodo = document.getElementById("vaciar-todo");

mostrarReservasGuardadas();

// Evento de envío del formulario //
formularioSimulador.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const destinoSeleccionado = document.getElementById("destino").value;
  const cantidadDias = parseInt(document.getElementById("dias").value);
  const cantidadPersonas = parseInt(document.getElementById("personas").value);

  // Validación de entradas //
  if (!destinoSeleccionado || cantidadDias <= 0 || cantidadPersonas <= 0 || isNaN(cantidadDias) || isNaN(cantidadPersonas)) {
    mostrarResultado("Por favor, completá todos los campos correctamente.");
    return;
  }

  const destinoEncontrado = destinos.find(destino => destino.nombre === destinoSeleccionado);
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

// Función para calcular costo total con IVA //
function calcularCostoTotal(precioPorDia, dias, personas) {
  const subtotal = precioPorDia * dias * personas;
  const iva = subtotal * 0.21;
  return subtotal + iva;
}

// Mostrar resultado en pantalla //
function mostrarResultado(mensajeHTML) {
  contenedorResultado.innerHTML = `<p>${mensajeHTML}</p>`;
}

// Mostrar reservas guardadas //
btnCheckout.addEventListener("click", () => {
  const reservas = obtenerReservas(); 

  if (reservas.length === 0) {
    alert("No hay reservas para finalizar.");
    return;
  }

  // Simular proceso de pago
  alert("Procesando pago...");

  // Mostrar mensaje de éxito
  alert("¡Reserva finalizada con éxito!");

  // Limpiar reservas
  localStorage.removeItem("reservas");
  mostrarReservasGuardadas();
  mostrarResultado("Reserva finalizada con éxito.");
});

// Guardar una nueva reserva en localStorage //
function guardarReserva(reserva) {
  const reservas = obtenerReservas();
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

// Obtener reservas existentes desde localStorage //
function obtenerReservas() {
  return JSON.parse(localStorage.getItem("reservas")) || [];
}

// Mostrar reservas guardadas //
function mostrarReservasGuardadas() {
  const reservas = obtenerReservas();

  if (reservas.length === 0) {
    contenedorReservas.innerHTML = "<p>No hay reservas guardadas aún.</p>";
    return;
  }

  contenedorReservas.innerHTML = "";

  reservas.forEach((reserva, indice) => {
    const tarjetaReserva = document.createElement("div");
    tarjetaReserva.classList.add("reserva-card");

    tarjetaReserva.innerHTML = `
      <p><strong>Reserva #${indice + 1}</strong></p>
      <p>Destino: ${reserva.destino}</p>
      <p>Días: ${reserva.dias}</p>
      <p>Personas: ${reserva.personas}</p>
      <p>Total: $${reserva.total.toFixed(2)}</p>
      <button class="editar-btn">Editar</button>
      <button class="eliminar-btn">Eliminar</button>
    `;

    contenedorReservas.appendChild(tarjetaReserva);

    const btnEditar = tarjetaReserva.querySelector(".editar-btn");
    const btnEliminar = tarjetaReserva.querySelector(".eliminar-btn");

    btnEditar.addEventListener("click", () => editarReserva(indice));
    btnEliminar.addEventListener("click", () => eliminarReserva(indice));
  });
}


// Vaciar todo //
botonVaciarTodo.addEventListener("click", () => {
  if (confirm("¿Estás seguro de que deseas eliminar todas las reservas? Esta acción no se puede deshacer.")) {
    localStorage.removeItem("reservas");
    mostrarReservasGuardadas();
    mostrarResultado("Se eliminaron todas las reservas.");
  }
});

// Eliminar reservas //
function eliminarReserva(indice) {
  const reservas = obtenerReservas();
  reservas.splice(indice, 1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarReservasGuardadas();
}

function editarReserva(indice) {
  const reservas = obtenerReservas();
  const reserva = reservas[indice];

  // Cargar los valores actuales en el formulario //
  document.getElementById("destino").value = reserva.destino;
  document.getElementById("dias").value = reserva.dias;
  document.getElementById("personas").value = reserva.personas;

  // Eliminar la reserva anterior //
  reservas.splice(indice, 1);
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarReservasGuardadas();
}
