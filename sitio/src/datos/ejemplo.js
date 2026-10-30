// Datos de ejemplo de las herramientas internas de Palo: solicitudes (Ticketera), documentos (Docs),
// altas (Onboarding) y algo de Pay. Mezclados a propósito: la librería sirve para todas. No son datos reales.
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
export const fechaCorta = (d) => `${d.getDate()} ${MESES[d.getMonth()]}`;
export const fechaLarga = (d) => `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;

// Bandeja de solicitudes: cada una viene de un área (la herramienta donde se originó).
export const solicitudes = [
  { codigo: 'TK-1042', asunto: 'No llega el mail de bienvenida', solicitante: 'Ana Ruiz', area: 'Onboarding', estado: 'Nueva', tono: 'info', horas: 2 },
  { codigo: 'TK-1039', asunto: 'Contrato sin la firma del garante', solicitante: 'Mariana Sosa', area: 'Docs', estado: 'Vencida', tono: 'error', horas: 52 },
  { codigo: 'TK-1037', asunto: 'Cobro con QR duplicado', solicitante: 'Lucas Gómez', area: 'Pay', estado: 'Por vencer', tono: 'aviso', horas: 21 },
  { codigo: 'TK-1031', asunto: 'Cambio de titular de la cuenta', solicitante: 'Julián Paz', area: 'Onboarding', estado: 'Resuelta', tono: 'ok', horas: 6 },
  { codigo: 'TK-1028', asunto: 'Plantilla de recibo desactualizada', solicitante: 'Carla Méndez', area: 'Docs', estado: 'Resuelta', tono: 'ok', horas: 11 },
];
// Bandeja ampliada para la tabla de datos (orden, selección, paginación): 24 solicitudes de ejemplo.
const ASUNTOS = ['No llega el mail de bienvenida', 'Contrato sin la firma del garante', 'Cobro con QR duplicado', 'Cambio de titular de la cuenta',
  'Plantilla de recibo desactualizada', 'Constancia de inscripción ilegible', 'Reintegro de un débito no reconocido', 'Alta de un nuevo usuario del equipo',
  'Factura emitida con CUIT equivocado', 'Pedido de baja de la cuenta', 'Error al subir el DNI', 'Transferencia demorada más de 48 h'];
const PERSONAS = ['Ana Ruiz', 'Mariana Sosa', 'Lucas Gómez', 'Julián Paz', 'Carla Méndez', 'Tomás Herrera'];
const AREAS = ['Onboarding', 'Docs', 'Pay'];
const ESTADOS = [['Nueva', 'info'], ['Por vencer', 'aviso'], ['Vencida', 'error'], ['Resuelta', 'ok'], ['Nueva', 'info'], ['Resuelta', 'ok']];
export const bandeja = Array.from({ length: 24 }, (_, i) => {
  const [estado, tono] = ESTADOS[(i * 5) % ESTADOS.length];
  return {
    codigo: `TK-${1060 - i * 3}`, asunto: ASUNTOS[(i * 7) % ASUNTOS.length], solicitante: PERSONAS[(i * 5) % PERSONAS.length],
    area: AREAS[(i * 2) % AREAS.length], estado, tono, horas: (i * 13) % 71 + 1, responsable: i % 4 === 0 ? '' : PERSONAS[(i + 2) % PERSONAS.length],
  };
});

export const estadosSolicitud = [{ valor: '', texto: 'Todas' }, { valor: 'info', texto: 'Nuevas' }, { valor: 'aviso', texto: 'Por vencer' }, { valor: 'error', texto: 'Vencidas' }, { valor: 'ok', texto: 'Resueltas' }];

// Solicitudes ingresadas por día, los 30 días hasta el 27 de octubre.
export const ingresos = Array.from({ length: 30 }, (_, i) => {
  const fecha = new Date(2026, 8, 28 + i);
  const dia = fecha.getDay();
  const v = 46 + i * 0.4 + Math.sin(i * 1.7) * 5 + (dia === 0 ? -30 : dia === 6 ? -22 : 0);
  return { fecha, cantidad: Math.round(v) };
});

export const porTipo = [['Contratos', 412], ['Facturas', 365], ['Recibos', 288], ['DNI', 214], ['Constancias', 167], ['Poderes', 52], ['Otros', 38]]
  .map(([tipo, documentos]) => ({ tipo, documentos }));

export const canalesPorMes = [
  { mes: 'Julio', Web: 38, Mail: 34, WhatsApp: 18, Teléfono: 10 },
  { mes: 'Agosto', Web: 41, Mail: 31, WhatsApp: 20, Teléfono: 8 },
  { mes: 'Septiembre', Web: 43, Mail: 28, WhatsApp: 22, Teléfono: 7 },
  { mes: 'Octubre', Web: 45, Mail: 25, WhatsApp: 24, Teléfono: 6 },
];

export const ejesEquipo = ['Respuesta a tiempo', 'Resueltas al primer contacto', 'Satisfacción', 'Cumplimiento de SLA', 'Documentación'];
export const perfilEquipo = [85, 45, 90, 70, 35];
export const perfilPromedio = [65, 60, 70, 75, 55];

// Espacio usado por cada área en Docs, en GB, contra su cuota.
export const espacios = [
  { area: 'Legales', detalle: '1.284 documentos', usado: 31.2, cuota: 50 },
  { area: 'Finanzas', detalle: '3.910 documentos', usado: 44.6, cuota: 50 },
  { area: 'Personas', detalle: '2.402 documentos', usado: 52.3, cuota: 50 },
];

export const ultimos14 = ingresos.slice(-14);
export const vencidas14 = [15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 10, 9, 9];
export const altas14 = [6, 9, 4, 7, 11, 8, 3, 5, 10, 7, 6, 9, 8, 7];
export const resueltas14 = [38, 44, 41, 12, 9, 47, 52, 49, 45, 14, 10, 51, 55, 48];
// Canal de ingreso de hoy; «Otros» (teléfono y presencial) es el resto y va en trama.
export const canalesHoy = [{ nombre: 'Web', valor: 45 }, { nombre: 'Mail', valor: 25 }, { nombre: 'WhatsApp', valor: 24 }, { nombre: 'Otros', valor: 6, resto: true }];

export const navegacionApp = [
  { titulo: 'Trabajo', items: [
    { texto: 'Bandeja', icono: 'bandeja', valor: 'bandeja', contador: 128 },
    { texto: 'Asignadas a mí', icono: 'ticket', valor: 'mias', contador: 7 },
    { texto: 'Vencidas', icono: 'reloj', valor: 'vencidas', contador: 9, tono: 'error' },
  ] },
  { titulo: 'Contenido', items: [
    { texto: 'Documentos', icono: 'documento', valor: 'documentos' },
    { texto: 'Altas', icono: 'usuarios', valor: 'altas', contador: 12, tono: 'aviso' },
    { texto: 'Informes', icono: 'informes', valor: 'informes' },
  ] },
  { titulo: 'Sistema', items: [{ texto: 'Ajustes', icono: 'ajustes', valor: 'ajustes' }] },
];
