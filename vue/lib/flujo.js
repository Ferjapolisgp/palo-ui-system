// Qué puede hacer cada persona con un ticket según el flujo (reglas iguales a las del servidor:
// server/estados.py y cambiar_estado en server/service.py). El servidor sigue siendo quien decide;
// esto solo evita ofrecer acciones que el servidor va a rechazar.
import { pideNota } from './estados.js';

const SOLICITUD = 'solicitud'; // tipo general: se cierra distinto (tipos.TIPO_POR_DEFECTO)
const REABRE = ['resuelto', 'verificado'];

// El botón dice lo que ocurre, no el nombre del estado al que se llega
function verbo(origen, destino) {
  if (destino === 'en_curso') return REABRE.includes(origen) ? 'Reabrir' : origen === 'esperando_info' ? 'Reanudar' : 'Procesar';
  return { aceptado: 'Aceptar', esperando_info: 'Pedir información', resuelto: 'Marcar resuelto', verificado: 'Verificar', cerrado: 'Cerrar', rechazado: 'Rechazar' }[destino] ?? destino;
}

// Paso que sigue en el camino normal; el resto son desvíos
function principal(estado, destinos) {
  const camino = { nuevo: 'aceptado', aceptado: 'en_curso', en_curso: 'resuelto', esperando_info: 'en_curso', resuelto: 'verificado', verificado: 'cerrado' }[estado];
  if (estado === 'resuelto' && !destinos.includes('verificado')) return 'cerrado';
  return camino;
}

const esQuienPidio = (t, yo) =>
  (t.registrado_por_id != null && yo?.id === t.registrado_por_id) ||
  (!!t.solicitante_email && (yo?.email || '').toLowerCase() === t.solicitante_email.toLowerCase());

// Campos de resolución que faltan completar (el servidor los exige para resolver)
export function faltantesParaResolver(t, campos) {
  const datos = t.datos ?? {};
  return campos.filter((c) => c.etapa === 'resolucion' && !(c.clave in datos)).map((c) => c.etiqueta);
}

// ¿Puede esta persona llevar el ticket a `destino`? { ok, motivo, nota }
export function puedeIr(t, yo, campos, destino) {
  if (!t.siguientes?.includes(destino)) return { ok: false, motivo: 'El flujo no permite este paso desde el estado actual' };
  let nota = pideNota(t.estado, destino);
  if (destino === 'resuelto') {
    const faltan = faltantesParaResolver(t, campos);
    if (faltan.length) return { ok: false, motivo: `Antes de resolver completá: ${faltan.join(', ')}` };
    if (t.aprobacion_pendiente) return { ok: false, motivo: 'Falta la aprobación: este ticket no se puede resolver sin aprobar' };
  }
  if (destino === 'verificado' && yo && t.resuelto_por_id === yo.id) {
    if (yo.rol !== 'admin') return { ok: false, motivo: 'No podés verificar lo que resolviste vos: tiene que hacerlo otra persona' };
    nota = { pregunta: 'Verificás tu propio trabajo: escribí la justificación. Queda registrada como excepción.', obligatoria: true };
  }
  if (destino === 'cerrado' && t.tipo === SOLICITUD && yo && yo.rol !== 'admin' && !esQuienPidio(t, yo)) {
    return { ok: false, motivo: 'Una solicitud la cierra quien la pidió o un administrador' };
  }
  return { ok: true, motivo: '', nota };
}

// Botones de acción del ticket, en orden: el paso normal primero, desvíos después y rechazar al final.
// Cada uno: { destino, texto, tono: 'principal'|'normal'|'peligro', ok, motivo, nota, confirmar }
export function acciones(t, yo, campos = []) {
  const destinos = t.siguientes ?? [];
  const sig = principal(t.estado, destinos);
  const lista = destinos.map((destino) => {
    const p = puedeIr(t, yo, campos, destino);
    return {
      destino, texto: verbo(t.estado, destino), ok: p.ok, motivo: p.motivo, nota: p.nota ?? null,
      tono: destino === 'rechazado' ? 'peligro' : destino === sig ? 'principal' : 'normal',
      confirmar: destino === 'cerrado', // cierre sin vuelta atrás: se pide confirmación
    };
  });
  const peso = (a) => (a.tono === 'principal' ? 0 : a.tono === 'peligro' ? 2 : 1);
  return lista.sort((a, b) => peso(a) - peso(b));
}

export const ESTADOS_FINALES = ['cerrado', 'rechazado'];

// Qué se puede cambiar de prioridad y de responsable según el estado (el servidor lo exige igual):
//  - abierto: la prioridad se cambia libremente; el responsable se toma o se reasigna (con motivo si ya había uno).
//  - resuelto o verificado: la prioridad queda fija; el responsable solo se reasigna (con motivo), por ejemplo
//    para que lo verifique otra persona, y nunca se deja sin responsable.
//  - cerrado o rechazado: todo fijo.
// Reabrir el ticket devuelve la edición libre.
export const LEYENDA_FIJO = 'Un ticket cerrado ya no admite cambios.';

export function reglasEdicion(t, yo) {
  const final = ESTADOS_FINALES.includes(t.estado);
  const posterior = REABRE.includes(t.estado);
  const fija = final || posterior;
  return {
    prioridad: {
      editable: !fija,
      motivo: fija ? LEYENDA_FIJO : '',
    },
    asignado: {
      puedeTomar: !fija && !!yo && t.asignado_id !== yo.id,
      puedeReasignar: !final,
      textoReasignar: t.estado === 'resuelto' ? 'Reasignar para verificar' : 'Reasignar',
      motivoObligatorio: t.asignado_id != null,
      motivo: final ? LEYENDA_FIJO : '',
    },
  };
}
