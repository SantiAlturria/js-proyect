// ui.js

(async () => {
    const destinoSelect = document.getElementById('destino');
    const diasInput = document.getElementById('dias');
    const personasInput = document.getElementById('personas');
    const mensaje = document.getElementById('mensaje');
    const listaReservas = document.getElementById('listaReservas');
    const formulario = document.getElementById('reservaForm');
    const btnSubmit = formulario.querySelector("button[type=submit]");

    let destinos = await obtenerDestinos();
    let reservas = obtenerReservas();
    let editandoId = null;

    // Cargar destinos al select
    destinos.forEach(destino => {
        const option = document.createElement('option');
        option.value = destino.id;
        option.textContent = `${destino.nombre} - $${destino.precio} por día`;
        destinoSelect.appendChild(option);
    });

    (async () => {
  let destinos = await obtenerDestinos();
  console.log("Destinos cargados:", destinos);
})();


    // Compilar plantilla Handlebars desde HTML
    const source = document.getElementById('plantilla-reserva').innerHTML;
    const plantilla = Handlebars.compile(source);

    function renderReservas() {
        if (reservas.length === 0) {
            listaReservas.innerHTML = "<li>No hay reservas</li>";
            return;
        }
        listaReservas.innerHTML = plantilla({ reservas });

        // Asignar eventos con event delegation
        listaReservas.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener('click', () => editarReserva(Number(btn.dataset.id)));
        });
        listaReservas.querySelectorAll(".btn-borrar").forEach(btn => {
            btn.addEventListener('click', () => borrarReserva(Number(btn.dataset.id)));
        });
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const destinoId = parseInt(destinoSelect.value);
        const dias = parseInt(diasInput.value);
        const personas = parseInt(personasInput.value);

        if (!destinoId || dias < 1 || personas < 1) {
            Swal.fire("Error", "Complete todos los campos correctamente", "error");
            return;
        }

        const destino = destinos.find(d => d.id === destinoId);
        if (!destino) {
            Swal.fire("Error", "Destino no válido", "error");
            return;
        }

        const costoTotal = (destino.precio * dias * personas * 1.21).toFixed(2);

        if (editandoId) {
            const index = reservas.findIndex(r => r.id === editandoId);
            if (index !== -1) {
                reservas[index] = {
                    id: editandoId,
                    destino: destino.nombre,
                    dias,
                    personas,
                    costo: costoTotal
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
                costo: costoTotal
            };
            reservas.push(nuevaReserva);
            Swal.fire("Éxito", "Reserva agregada", "success");
        }

        guardarReservas(reservas);
        renderReservas();
        formulario.reset();
    });

    function borrarReserva(id) {
        Swal.fire({
            title: "¿Eliminar esta reserva?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) {
                reservas = reservas.filter(r => r.id !== id);
                guardarReservas(reservas);
                renderReservas();
                Swal.fire("Eliminado", "La reserva ha sido eliminada", "success");
            }
        });
    }

    function editarReserva(id) {
        const r = reservas.find(r => r.id === id);
        if (r) {
            const destinoObj = destinos.find(d => d.nombre === r.destino);
            if (destinoObj) {
                destinoSelect.value = destinoObj.id;
                diasInput.value = r.dias;
                personasInput.value = r.personas;
                editandoId = id;
                btnSubmit.textContent = "Guardar cambios";
            }
        }
    }

    // Renderizamos reservas al cargar
    renderReservas();
})();

