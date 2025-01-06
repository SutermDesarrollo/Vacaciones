export async function calcularDiasPorDescontar(
  fechaInicio,
  fechaFin,
  tipoRol,
  diasFestivos
) {
  let diasRestantes = [];

  // Convertimos las fechas a objetos Date
  let inicio = dayjs(fechaInicio);
  let fin = dayjs(fechaFin);

  // Recorremos el rango de fechas
  while (inicio <= fin) {
    let diaSemana = inicio.day(); // Obtiene el día de la semana (0 = domingo, 6 = sábado)

    // Verificamos si es un día festivo o de descanso
    const esFestivo = await isFestividad(inicio, diasFestivos);

    let esDescanso = false;
    if (tipoRol == 1) {
      if (diaSemana === 6 || diaSemana === 0) {
        esDescanso = true;
      }
    }

    // Si no es festivo ni de descanso, lo agregamos al conteo de días
    if (!esFestivo && !esDescanso) {
      diasRestantes.push(inicio);
    }

    // Pasamos al siguiente día
    inicio = inicio.add(1, "day");
  }

  return diasRestantes.length;
}
