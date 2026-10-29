import { reactive } from 'vue';

// Cola de notificaciones de la app. <Notificaciones /> se monta una sola vez y dibuja esta lista.
export const notificaciones = reactive([]);
let siguiente = 1;

// notificar({ titulo, detalle?, deshacer?, duracion? }): confirma una acción recién hecha.
// Con `deshacer` aparece el botón «Deshacer». Se cierra sola a los `duracion` ms (5 s por defecto).
export function notificar({ titulo, detalle = '', deshacer = null, duracion = 5000 }) {
  const id = siguiente++;
  notificaciones.unshift({ id, titulo, detalle, deshacer });
  if (duracion) setTimeout(() => cerrarNotificacion(id), duracion);
  return id;
}

export function cerrarNotificacion(id) {
  const i = notificaciones.findIndex((n) => n.id === id);
  if (i >= 0) notificaciones.splice(i, 1);
}
