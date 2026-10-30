<script setup>
import { computed, ref } from 'vue';
import GraficoMarco from './GraficoMarco.vue';
import GraficoTip from './GraficoTip.vue';
import { formatoNumero, posicion, ticks, usarAncho } from '../../lib/graficos.js';

// Un valor a lo largo del tiempo. Línea de 2 px con área suave, el último valor rotulado
// y una línea vertical que sigue al puntero con el detalle del punto.
const props = defineProps({
  datos: { type: Array, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  etiqueta: { type: String, default: 'Valor' },
  descripcion: { type: String, required: true },
  formato: { type: Function, default: formatoNumero },
  formatoX: { type: Function, default: (v) => String(v) },
  alto: { type: Number, default: 240 },
});

const lienzo = ref(null);
const svg = ref(null);
const ancho = usarAncho(lienzo);
const m = { t: 14, r: 72, b: 28, l: 40 };
const hover = ref(null);

const g = computed(() => {
  const W = Math.max(ancho.value, 280), H = props.alto, n = props.datos.length;
  const vals = props.datos.map((d) => d[props.y]);
  const tk = ticks(Math.max(...vals)), tope = tk[tk.length - 1];
  const px = (i) => m.l + (n > 1 ? i * (W - m.l - m.r) / (n - 1) : 0);
  const py = (v) => m.t + (1 - v / tope) * (H - m.t - m.b);
  const linea = vals.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join('');
  const cada = Math.max(1, Math.ceil(n / Math.max(2, Math.floor((W - m.l - m.r) / 80))));
  return { W, H, n, vals, tk, px, py, linea, area: `${linea}L${px(n - 1)},${py(0)}L${px(0)},${py(0)}Z`, cada };
});
const tabla = computed(() => ({ columnas: ['', props.etiqueta], filas: props.datos.map((d) => [props.formatoX(d[props.x]), props.formato(d[props.y])]) }));

function mover(e) {
  const { W, n } = g.value;
  const i = Math.max(0, Math.min(n - 1, Math.round((posicion(e, svg.value)[0] - m.l) / (W - m.l - m.r) * (n - 1))));
  hover.value = i;
}
const tip = computed(() => {
  if (hover.value == null) return null;
  const d = props.datos[hover.value];
  return { x: g.value.px(hover.value), y: g.value.py(d[props.y]), titulo: props.formatoX(d[props.x]), filas: [{ color: 'var(--serie-1)', nombre: props.etiqueta, valor: props.formato(d[props.y]) }] };
});
</script>

<template>
  <GraficoMarco :etiqueta="descripcion" :tabla="tabla">
    <div ref="lienzo">
      <svg ref="svg" :width="g.W" :height="g.H" aria-hidden="true">
        <template v-for="t in g.tk" :key="t">
          <line class="g" :x1="m.l" :x2="g.W - m.r" :y1="g.py(t)" :y2="g.py(t)" />
          <text class="ax" :x="m.l - 8" :y="g.py(t) + 4" text-anchor="end">{{ formatoNumero(t) }}</text>
        </template>
        <template v-for="(d, i) in datos" :key="i">
          <text v-if="i % g.cada === 0" class="ax" :x="g.px(i)" :y="g.H - 8" text-anchor="middle">{{ formatoX(d[x]) }}</text>
        </template>
        <path :d="g.area" class="area" />
        <path :d="g.linea" class="linea" />
        <circle class="punto" :cx="g.px(g.n - 1)" :cy="g.py(g.vals[g.n - 1])" r="4" />
        <text class="et" :x="g.px(g.n - 1) + 9" :y="g.py(g.vals[g.n - 1]) + 4">{{ formato(g.vals[g.n - 1]) }}</text>
        <template v-if="hover != null">
          <line class="cruz" :x1="g.px(hover)" :x2="g.px(hover)" :y1="m.t" :y2="g.H - m.b" />
          <circle class="punto" :cx="g.px(hover)" :cy="g.py(g.vals[hover])" r="4" />
        </template>
        <rect :x="m.l" y="0" :width="g.W - m.l - m.r" :height="g.H - m.b" fill="transparent" @pointermove="mover" @pointerleave="hover = null" />
      </svg>
      <GraficoTip v-if="tip" v-bind="tip" :ancho="g.W" />
    </div>
  </GraficoMarco>
</template>

<style scoped>
.area { fill: var(--serie-1); opacity: .12; }
.linea { fill: none; stroke: var(--serie-1); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.punto { fill: var(--serie-1); stroke: var(--bg); stroke-width: 2; }
</style>
