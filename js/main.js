const destinos = ["Bariloche", "Mendoza", "Salta"];
const preciosPorDia = [15000, 12000, 10000]; 


function mostrarDestinos(destinos) {
  let mensaje = "Destinos disponibles:\n";
  for (let i = 0; i < destinos.length; i++) {
    mensaje += `${i + 1}. ${destinos[i]} - $${preciosPorDia[i]} por día\n`;
  }
  alert(mensaje);
}


function calcularCostoTotal(indiceDestino, dias, personas) {
  const precioBase = preciosPorDia[indiceDestino];
  const subtotal = precioBase * dias * personas;
  const iva = subtotal * 0.21;
  return subtotal + iva;
}


function confirmarReserva(destino, total) {
  return confirm(`¿Deseás confirmar la reserva a ${destino} por un total de $${total.toFixed(2)}?`);
}


mostrarDestinos(destinos);

let seleccion = parseInt(prompt("Ingrese el número del destino elegido:")) - 1;

if (seleccion >= 0 && seleccion < destinos.length) {
  let dias = parseInt(prompt("¿Cuántos días vas a quedarte?"));
  let personas = parseInt(prompt("¿Cuántas personas viajan?"));

  if (dias > 0 && personas > 0) {
    let total = calcularCostoTotal(seleccion, dias, personas);
    alert(`El costo total del viaje a ${destinos[seleccion]} es de $${total.toFixed(2)} (IVA incluido).`);

    if (confirmarReserva(destinos[seleccion], total)) {
      alert("¡Reserva confirmada! Gracias por usar nuestro simulador.");
    } else {
      alert("Reserva cancelada.");
    }

  } else {
    alert("Error: Debés ingresar días y personas mayores a 0.");
  }

} else {
  alert("Destino inválido. Por favor, recargá la página e intentá nuevamente.");
}
