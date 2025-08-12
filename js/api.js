/**
 * Obtiene la lista de destinos desde el archivo JSON.
 * @returns {Promise<Array>}
 */
async function obtenerDestinos() {
    try {
        const respuesta = await fetch('./data/destinos.json');

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error cargando destinos:", error.message);
        return [];
    }
}

/**
 * Guarda las reservas en localStorage.
 * @param {Array} reservas - Lista de reservas.
 */
function guardarReservas(reservas = []) {
    try {
        localStorage.setItem('reservas', JSON.stringify(reservas));
    } catch (error) {
        console.error("Error guardando reservas:", error.message);
    }
}

/**
 * Obtiene las reservas guardadas desde localStorage.
 * @returns {Array} Lista de reservas.
 */
function obtenerReservas() {
    try {
        const reservas = localStorage.getItem('reservas');
        return reservas ? JSON.parse(reservas) : [];
    } catch (error) {
        console.error("Error leyendo reservas:", error.message);
        return [];
    }
}
