// Punto de entrada de los componentes Vue 3. Requiere css/palo-ui-system.css cargado en la página.

// Interfaz genérica
export { default as Aviso } from './components/ui/Aviso.vue';
export { default as Avatar } from './components/ui/Avatar.vue';
export { default as BarraHerramientas } from './components/ui/BarraHerramientas.vue';
export { default as BarraLateral } from './components/ui/BarraLateral.vue';
export { default as BarraUso } from './components/ui/BarraUso.vue';
export { default as CabeceraPagina } from './components/ui/CabeceraPagina.vue';
export { default as CodigoVerificacion } from './components/ui/CodigoVerificacion.vue';
export { default as Confirmar } from './components/ui/Confirmar.vue';
export { default as ConfigurarMfa } from './components/ui/ConfigurarMfa.vue';
export { default as Drawer } from './components/ui/Drawer.vue';
export { default as CurrencyInput } from './components/ui/CurrencyInput.vue';
export { default as DataTable } from './components/ui/DataTable.vue';
export { default as DatePicker } from './components/ui/DatePicker.vue';
export { default as Descriptions } from './components/ui/Descriptions.vue';
export { default as Desplegable } from './components/ui/Desplegable.vue';
export { default as Field } from './components/ui/Field.vue';
export { default as GrillaCupos } from './components/ui/GrillaCupos.vue';
export { default as Icono } from './components/ui/Icono.vue';
export { default as Indicador } from './components/ui/Indicador.vue';
export { default as Interruptor } from './components/ui/Interruptor.vue';
export { default as Marca } from './components/ui/Marca.vue';
export { default as Modal } from './components/ui/Modal.vue';
export { default as Notificaciones } from './components/ui/Notificaciones.vue';
export { default as Overlay } from './components/ui/Overlay.vue';
export { default as Paginacion } from './components/ui/Paginacion.vue';
export { default as Popover } from './components/ui/Popover.vue';
export { default as Skeleton } from './components/ui/Skeleton.vue';
export { default as Spin } from './components/ui/Spin.vue';
export { default as Tarjeta } from './components/ui/Tarjeta.vue';
export { default as Tooltip } from './components/ui/Tooltip.vue';
export { default as Vacio } from './components/ui/Vacio.vue';
export { aplicarTema, leerTema } from './lib/tema.js';
export { notificar, cerrarNotificacion } from './lib/notificaciones.js';
export { ICONOS } from './lib/iconos.js';
export { agruparSecreto, uriTotp } from './lib/mfa.js';
export { aIso, deIso, formatoFecha, hoyIso, interpretarFecha, sumarDias, sumarMeses } from './lib/fechas.js';
export { interpretarMonto } from './lib/montos.js';
export { useFloating } from './lib/floating.js';
export { useFocusTrap } from './lib/focus.js';

// Gráficos
export { default as GraficoBarras } from './components/graficos/GraficoBarras.vue';
export { default as GraficoComposicion } from './components/graficos/GraficoComposicion.vue';
export { default as GraficoLinea } from './components/graficos/GraficoLinea.vue';
export { default as GraficoRadar } from './components/graficos/GraficoRadar.vue';
export { default as GraficoTope } from './components/graficos/GraficoTope.vue';
export { formatoMillones, formatoNumero, formatoPesos, formatoPorcentaje } from './lib/graficos.js';

// Dominio ticket (de la Ticketera): sirven como modelo o si la herramienta maneja ese ciclo de vida
export { default as AccionesFlujo } from './components/ui/AccionesFlujo.vue';
export { default as BandaAdvertencia } from './components/ui/BandaAdvertencia.vue';
export { default as EstadoTag } from './components/ui/EstadoTag.vue';
export { default as MedidorFlujo } from './components/ui/MedidorFlujo.vue';
export { default as PrioridadMarca } from './components/ui/PrioridadMarca.vue';
export { default as ReasignarModal } from './components/ui/ReasignarModal.vue';
export { default as VenceTicket } from './components/ui/VenceTicket.vue';
export { default as CodigoTicket } from './components/CodigoTicket.vue';
export * as flujo from './lib/flujo.js';
export * as visual from './lib/visual.js';
