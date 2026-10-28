// Funciones puras de formato que usan los componentes (sin red ni rutas).
const CERRADOS = ['resuelto', 'cerrado', 'rechazado'];
export const TERMINADOS = ['resuelto', 'verificado', 'cerrado', 'rechazado'];

export function duracion(h) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  return h < 48 ? `${Math.floor(h)} h` : `${Math.floor(h / 24)} d`;
}

// Texto de vencimiento y nivel de alerta ('vencido' | 'pronto' | '')
export function vencimiento(t) {
  if (!t.vence || CERRADOS.includes(t.estado)) return { texto: '', nivel: '' };
  const horas = (new Date(t.vence) - Date.now()) / 36e5;
  if (horas < 0) return { texto: `vencido hace ${duracion(-horas)}`, nivel: 'vencido' };
  return { texto: `vence en ${duracion(horas)}`, nivel: horas < 4 ? 'pronto' : '' };
}

export function iniciales(nombre) {
  return (nombre || '?').split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}
