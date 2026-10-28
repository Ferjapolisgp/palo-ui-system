// Qué nota pide pasar de un estado a otro (reglas iguales a las del servidor: server/estados.py).
// Devuelve { pregunta, obligatoria } o null si no hace falta nota.
export function pideNota(origen, destino) {
  if (destino === 'esperando_info') return { pregunta: '¿Qué necesitás saber del solicitante?', obligatoria: true };
  if (destino === 'rechazado') return { pregunta: 'Motivo del rechazo', obligatoria: true };
  if (destino === 'en_curso' && ['resuelto', 'verificado'].includes(origen)) {
    return { pregunta: 'Motivo de la reapertura', obligatoria: true };
  }
  if (destino === 'resuelto') return { pregunta: 'Resolución (opcional)', obligatoria: false };
  if (destino === 'verificado') {
    return { pregunta: 'Verificación (obligatoria si la resolviste vos y sos administrador: queda como excepción)', obligatoria: false };
  }
  return null;
}

// Columnas visibles por defecto; cerrado y rechazado se muestran con el interruptor
export const COLUMNAS_ACTIVAS = ['nuevo', 'pendiente_aprobacion', 'aceptado', 'en_curso', 'esperando_info', 'resuelto', 'verificado'];
export const COLUMNAS_ARCHIVO = ['cerrado', 'rechazado'];

// Color de cada estado (para las etiquetas de la lista) y orden en que ocurren
export const ESTADO_COLOR = {
  nuevo: '#3b82c4', pendiente_aprobacion: '#d9822b', aceptado: '#2f8f8f', en_curso: '#4a6fd1',
  esperando_info: '#8a63c4', resuelto: '#3f9462', verificado: '#2f7d4f', cerrado: '#8a8a84', rechazado: '#b0483f',
};
export const ORDEN_ESTADO = ['nuevo', 'pendiente_aprobacion', 'aceptado', 'en_curso', 'esperando_info', 'resuelto', 'verificado', 'cerrado', 'rechazado'];
export const RANGO_PRIORIDAD = { urgente: 0, alta: 1, normal: 2, baja: 3 };
