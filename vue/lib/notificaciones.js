import { reactive } from 'vue';

// Cola de notificaciones de la app. <Notificaciones /> se monta una sola vez y dibuja esta lista.
export const notificaciones = reactive([]);
let siguiente = 1;

// Cuánto queda cada tono si no se pasa `duracion`. Error no se va solo: hay que leerlo y decidir.
const DURACION = { ok: 5000, info: 6000, aviso: 8000, error: 0 };
// Temporizadores fuera de lo reactivo: pausar y reanudar no tiene que redibujar nada.
const relojes = new Map();

// notificar({ titulo, detalle?, tono?, icono?, variante?, accion?, deshacer?, duracion?, canal? })
//   tono      'ok' (por defecto) | 'info' | 'aviso' | 'error': color e ícono de forma distinta.
//   variante  'normal' | 'compacta' (una línea) | 'alerta' (cinta de precaución, ver alertar()).
//   accion    { texto, hacer }: botón propio («Reintentar», «Ver»); cierra la notificación al tocarlo.
//   deshacer  función: aparece «Deshacer».
//   duracion  ms antes de cerrarse; 0 la deja fija. Por defecto según el tono.
//   canal     solo la dibuja el <Notificaciones> con ese canal (por ejemplo, una vista previa).
export function notificar({ titulo, detalle = '', tono = 'ok', icono = '', variante = 'normal', accion = null, deshacer = null, duracion, canal = '' }) {
  const id = siguiente++;
  const ms = duracion ?? (variante === 'alerta' ? 0 : DURACION[tono] ?? 5000);
  notificaciones.unshift({ id, titulo, detalle, tono, icono, variante, accion, deshacer, duracion: ms, pausada: false, canal });
  if (ms) correr(id, ms);
  return id;
}

// Alerta: lo que hay que ver sí o sí (un bloqueo, un riesgo). Queda fija hasta que la persona actúa:
// en error no hay cruz, se cierra con `accion` (o con «Entendido» si no se pasa ninguna).
export const alertar = (opciones) => notificar({ tono: 'error', ...opciones, variante: 'alerta' });

function correr(id, ms) {
  relojes.set(id, { restante: ms, desde: Date.now(), motivos: new Set(), timer: setTimeout(() => cerrarNotificacion(id), ms) });
}

// El reloj se frena mientras haya algún motivo: la persona la está leyendo ('puntero', 'foco') o no se ve porque
// quedó en «+N más» ('oculta'). Con motivos separados, sacar el puntero no reanuda una que sigue oculta.
export function pausarNotificacion(id, motivo = 'puntero') {
  const r = relojes.get(id);
  const n = notificaciones.find((x) => x.id === id);
  if (!r || !n || r.motivos.has(motivo)) return;
  if (!r.motivos.size) {
    clearTimeout(r.timer);
    r.restante -= Date.now() - r.desde;
  }
  r.motivos.add(motivo);
  n.pausada = true;
}

export function reanudarNotificacion(id, motivo = 'puntero') {
  const r = relojes.get(id);
  const n = notificaciones.find((x) => x.id === id);
  if (!r || !n || !r.motivos.delete(motivo) || r.motivos.size) return;
  r.desde = Date.now();
  r.timer = setTimeout(() => cerrarNotificacion(id), Math.max(r.restante, 0));
  n.pausada = false;
}

export function cerrarNotificacion(id) {
  clearTimeout(relojes.get(id)?.timer);
  relojes.delete(id);
  const i = notificaciones.findIndex((n) => n.id === id);
  if (i >= 0) notificaciones.splice(i, 1);
}

export function cerrarTodas(canal = '') {
  notificaciones.filter((n) => n.canal === canal).forEach((n) => cerrarNotificacion(n.id));
}
