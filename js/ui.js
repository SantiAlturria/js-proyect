(async () => {
  const destinoSelect = document.getElementById("destino");
  const diasInput = document.getElementById("dias");
  const personasInput = document.getElementById("personas");
  const listaReservas = document.getElementById("listaReservas");
  const formulario = document.getElementById("reservaForm");
  const btnSubmit = formulario.querySelector("button[type=submit]");

  // Placeholder en el select
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Seleccione un destino";
  optionDefault.disabled = true;
  optionDefault.selected = true;
  destinoSelect.appendChild(optionDefault);

  let destinos = await obtenerDestinos();
  let reservas = filtrarReservasInvalidas(obtenerReservas());
  let editandoId = null;

  // Cargar destinos
  destinos.forEach((destino) => {
    const option = document.createElement("option");
    option.value = destino.id;
    option.textContent = `${destino.nombre} - $${destino.precio} por día`;
    destinoSelect.appendChild(option);
  });

  function filtrarReservasInvalidas(lista) {
    const filtradas = lista.filter(
      (r) =>
        r.dias > 0 && r.personas > 0 && r.costo && typeof r.destino === "string"
    );
    if (filtradas.length !== lista.length) {
      guardarReservas(filtradas);
    }
    return filtradas;
  }

  function renderReservas() {
    if (reservas.length === 0) {
      listaReservas.innerHTML = "<li>No hay reservas</li>";
      return;
    }

    listaReservas.innerHTML = reservas
      .map(
        (r) => `
        <li>
          <strong>${r.destino}</strong> - ${r.dias} días - ${r.personas} personas - $${r.costo}
          <button class="btn-general btn-editar" data-id="${r.id}">Editar</button>
          <button class="btn-general btn-borrar" data-id="${r.id}">Eliminar</button>
          ${
            r.confirmada
              ? `<button class="btn-general btn-confirmada" disabled>✅Confirmada</button>`
              : `<button class="btn-general btn-confirmar" data-id="${r.id}">Confirmar</button>`
          }
        </li>
      `
      )
      .join("");

    listaReservas.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", () =>
        editarReserva(Number(btn.dataset.id))
      );
    });
    listaReservas.querySelectorAll(".btn-borrar").forEach((btn) => {
      btn.addEventListener("click", () =>
        borrarReserva(Number(btn.dataset.id))
      );
    });
    listaReservas.querySelectorAll(".btn-confirmar").forEach((btn) => {
      btn.addEventListener("click", () =>
        confirmarReserva(Number(btn.dataset.id))
      );
    });
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const destinoId = parseInt(destinoSelect.value);
    const dias = parseInt(diasInput.value);
    const personas = parseInt(personasInput.value);

    if (
      !destinoId ||
      isNaN(dias) ||
      dias < 1 ||
      dias > 30 ||
      isNaN(personas) ||
      personas < 1 ||
      personas > 10
    ) {
      Swal.fire(
        "Error",
        "¡Atención! En caso de que su reserva supere los 30 días de reserva o necesite reservar para 10 personas, porfavor, comuniquesé con nosotros. ¡Muchas gracias!",
        "error"
      );
      return;
    }

    const destino = destinos.find((d) => d.id === destinoId);
    if (!destino) {
      Swal.fire("Error", "Destino no válido", "error");
      return;
    }

    const costoTotal = (destino.precio * dias * personas * 1.21).toFixed(2);

    if (editandoId) {
      const index = reservas.findIndex((r) => r.id === editandoId);
      if (index !== -1) {
        reservas[index] = {
          ...reservas[index],
          destino: destino.nombre,
          dias,
          personas,
          costo: costoTotal,
        };
        Swal.fire("Listo", "Reserva actualizada", "success");
      }
      editandoId = null;
      btnSubmit.textContent = "Agregar Reserva";
    } else {
      const nuevaReserva = {
        id: Date.now(),
        destino: destino.nombre,
        dias,
        personas,
        costo: costoTotal,
        confirmada: false,
      };
      reservas.push(nuevaReserva);
      Swal.fire("Éxito", "Reserva agregada", "success");
    }

    guardarReservas(reservas);
    renderReservas();
    formulario.reset();
    destinoSelect.value = "";
  });

  function borrarReserva(id) {
    Swal.fire({
      title: "¿Eliminar esta reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        reservas = reservas.filter((r) => r.id !== id);
        guardarReservas(reservas);
        renderReservas();
        Swal.fire("Eliminado", "La reserva ha sido eliminada", "success");
      }
    });
  }

  function editarReserva(id) {
    const r = reservas.find((r) => r.id === id);
    if (r) {
      const destinoObj = destinos.find((d) => d.nombre === r.destino);
      if (destinoObj) {
        destinoSelect.value = String(destinoObj.id);
        diasInput.value = r.dias;
        personasInput.value = r.personas;
        editandoId = id;
        btnSubmit.textContent = "Guarda los cambios de tus cambios realizados";
      }
    }
  }

  function confirmarReserva(id) {
    const r = reservas.find((r) => r.id === id);
    if (!r) return;

    Swal.fire({
      title: "Confirmar Reserva",
      html: `
        <p><strong>Destino:</strong> ${r.destino}</p>
        <p><strong>Días:</strong> ${r.dias}</p>
        <p><strong>Personas:</strong> ${r.personas}</p>
        <p><strong>Total:</strong> $${r.costo}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirmar pago",
      cancelButtonText: "Editar",
    }).then((result) => {
      if (result.isConfirmed) {
        let contador = 3;
        Swal.fire({
          title: "Procesando pago...",
          html: `Tu pago se confirmará en <b>${contador}</b> segundos`,
          allowOutsideClick: false,
          timer: 3000,
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector("b");
            const timer = setInterval(() => {
              contador--;
              b.textContent = contador;
              if (contador <= 0) clearInterval(timer);
            }, 1000);
          },
        }).then(() => {
          r.confirmada = true;
          guardarReservas(reservas);
          renderReservas();
          Swal.fire(
            "¡Felicidades!",
            "Tu reserva ha sido confirmada con éxito",
            "success"
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        editarReserva(id);
      }
    });
  }

  renderReservas();
})();
