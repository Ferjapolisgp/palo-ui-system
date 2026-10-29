import { onBeforeUnmount, onMounted, ref } from 'vue';

// Utilidades de los gráficos: escalas, formatos en es-AR y el ancho del contenedor.

// Marcas «redondas» del eje: 0, paso, 2·paso… hasta cubrir `max` en unas `n` divisiones.
export function ticks(max, n = 4) {
  if (!(max > 0)) return [0, 1];
  const crudo = max / n;
  const p = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].find((m) => m * p >= crudo) * p;
  const tope = Math.ceil(max / paso) * paso;
  return Array.from({ length: Math.round(tope / paso) + 1 }, (_, i) => +(i * paso).toFixed(6));
}

export const formatoNumero = (v) => v.toLocaleString('es-AR');
export const formatoPesos = (v) => `$ ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatoMillones = (v) => `$ ${v.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
export const formatoPorcentaje = (v) => `${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })} %`;

// Color de la serie i (0, 1, 2, 3) en el orden fijo de la paleta.
export const colorSerie = (i) => `var(--serie-${i + 1})`;

// Ancho en píxeles de un elemento, actualizado cuando cambia de tamaño.
export function usarAncho(el) {
  const ancho = ref(0);
  let ro;
  onMounted(() => {
    if (!el.value) return;
    ancho.value = Math.round(el.value?.clientWidth || 0);
    ro = new ResizeObserver(([e]) => { ancho.value = Math.round(e.contentRect.width); });
    ro.observe(el.value);
  });
  onBeforeUnmount(() => ro?.disconnect());
  return ancho;
}

// Posición del puntero relativa a un SVG.
export function posicion(evento, svg) {
  const r = svg.getBoundingClientRect();
  return [evento.clientX - r.left, evento.clientY - r.top];
}
