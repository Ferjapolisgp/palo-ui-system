import { COMPONENTES } from './componentes.js';

// Menú lateral del sitio, en orden: secciones (las mismas de la barra superior) con sus grupos.
// Cada entrada: [texto, ruta].
const comp = (id) => [COMPONENTES[id].titulo, `/componentes/${id}`];

export const NAVEGACION = [
  { seccion: 'Guía', clave: 'guia', grupos: [
    ['Empezar', [['Inicio', '/'], ['Instalación', '/instalacion']]],
    ['Fundamentos', [['Marca', '/marca'], ['Color', '/color'], ['Tipografía', '/tipografia'], ['Reglas de uso', '/reglas']]],
  ] },
  { seccion: 'Componentes', clave: 'componentes', grupos: [
    ['Base', ['boton', 'campo', 'etiqueta', 'avatar', 'logo', 'icono'].map(comp)],
    ['Navegación', ['barra-lateral', 'cabecera', 'paginacion'].map(comp)],
    ['Datos', ['tabla', 'data-table', 'descriptions', 'tarjeta', 'profile-card', 'action-card', 'indicador', 'barra-uso', 'grilla-cupos', 'skeleton'].map(comp)],
    ['Formularios', ['field', 'currency-input', 'date-picker'].map(comp)],
  ['Filtros', ['barra-herramientas', 'desplegable', 'interruptor'].map(comp)],
    ['Respuesta', ['aviso', 'notificacion', 'confirmar', 'vacio'].map(comp)],
  ['Capas', ['modal', 'drawer', 'tooltip', 'popover', 'overlay'].map(comp)],
    ['Seguridad', ['codigo-verificacion', 'mfa'].map(comp)],
  ] },
  { seccion: 'Gráficos', clave: 'graficos', grupos: [
    ['Cómo elegir', [['Guía de gráficos', '/graficos']]],
    ['Tipos', ['grafico-linea', 'grafico-barras', 'grafico-composicion', 'grafico-radar', 'grafico-tope'].map(comp)],
  ] },
];

export const PLANO = NAVEGACION.flatMap(({ seccion, clave, grupos }) =>
  grupos.flatMap(([grupo, items]) => items.map(([texto, ruta]) => ({ seccion, clave, grupo, texto, ruta }))));
