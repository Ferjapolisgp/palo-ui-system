// Reglas visuales compartidas por los componentes de components/ui (docs/00-contexto/sistema-visual.md).
import { duracion, TERMINADOS } from './formato.js';

// El estado se muestra en una sola palabra, para que todas las etiquetas midan lo mismo.
export const ESTADO_CORTO = {
  nuevo: 'Nuevo', pendiente_aprobacion: 'Aprobación', aceptado: 'Aceptado', en_curso: 'Procesando',
  esperando_info: 'Espera', resuelto: 'Resuelto', verificado: 'Verificado', cerrado: 'Cerrado', rechazado: 'Rechazado',
};

// Pasos del ticket según su tipo (docs/00-contexto/ciclo-de-vida-del-ticket.md): los tipos con aprobación nacen en
// «Aprobación» (no pasan por «Nuevo») y los que tienen verificación independiente suman «Verificado» antes de cerrar.
// «Esperando info» es una pausa dentro de «Procesando».
export function rutaDe(t) {
  return [
    t.requiere_aprobacion ? 'Aprobación' : 'Nuevo', 'Aceptado', 'Procesando', 'Resuelto',
    ...(t.verificacion === 'independiente' ? ['Verificado'] : []), 'Cerrado',
  ];
}
const PASO_DE_ESTADO = {
  nuevo: 'Nuevo', pendiente_aprobacion: 'Aprobación', aceptado: 'Aceptado', en_curso: 'Procesando',
  esperando_info: 'Procesando', resuelto: 'Resuelto', verificado: 'Verificado', cerrado: 'Cerrado',
};
// Paso actual (1 = primero) dentro de la ruta; 0 si el estado no está en ella (rechazado)
export function pasoDe(t, ruta = rutaDe(t)) {
  return ruta.indexOf(PASO_DE_ESTADO[t.estado]) + 1;
}
// El medidor tiene ancho fijo: con más pasos que este tope se agrupan.
export const MAX_TRAMOS = 8;

// Tramos del medidor: cuántos se dibujan y cuántos van llenos para el paso actual de una ruta de n pasos.
export function tramos(n, paso) {
  const total = Math.max(1, Math.min(n, MAX_TRAMOS));
  return { total, llenos: Math.min(total, Math.ceil((paso * total) / n)) };
}

// Horas hasta el vencimiento (negativas si ya venció); null si no corre plazo.
export function horasHasta(t) {
  if (!t.vence || TERMINADOS.includes(t.estado)) return null;
  return (new Date(t.vence) - Date.now()) / 36e5;
}

// 'error' vencido · 'aviso' vence en 24 h o menos · 'ok' · 'nada' sin plazo
export function nivelPlazo(t) {
  const h = horasHasta(t);
  if (h === null) return 'nada';
  return h < 0 ? 'error' : h <= 24 ? 'aviso' : 'ok';
}

// Banda de advertencia: solo para urgentes vencidos (rojo) o que vencen en 24 h (naranja).
export function bandaAdvertencia(t) {
  if (t.prioridad !== 'urgente') return null;
  const nivel = nivelPlazo(t);
  if (nivel !== 'error' && nivel !== 'aviso') return null;
  const h = horasHasta(t);
  return { nivel, texto: nivel === 'error' ? `Vencido hace ${duracion(-h)}` : `Vence en ${duracion(h)}` };
}
