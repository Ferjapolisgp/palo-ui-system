<script setup>
import { computed, ref } from 'vue';
import GraficoMarco from './GraficoMarco.vue';
import GraficoTip from './GraficoTip.vue';
import { formatoNumero, formatoPorcentaje, ticks, usarAncho } from '../../lib/graficos.js';

// Cantidades por categoría. Barras finas con la punta redondeada, eje desde cero.
// Se rotula la barra mayor (o todas, o ninguna); el resto se lee al pasar el puntero.
const props = defineProps({
  datos: { type: Array, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  etiqueta: { type: String, default: 'Valor' },
  descripcion: { type: String, required: true },
  formato: { type: Function, default: formatoNumero },
  rotular: { type: String, default: 'mayor' },
  alto: { type: Number, default: 240 },
});

const lienzo = ref(null);
const ancho = usarAncho(lienzo);
const m = { t: 22, r: 6, b: 28, l: 40 };
const hover = ref(null);

const g = computed(() => {
  const W = Math.max(ancho.value, 260), H = props.alto, n = props.datos.length;
  const vals = props.datos.map((d) => d[props.y]);
  const max = Math.max(...vals), tk = ticks(max), tope = tk[tk.length - 1];
  const py = (v) => m.t + (1 - v / tope) * (H - m.t - m.b);
  const banda = (W - m.l - m.r) / n, bw = Math.min(banda * 0.62, 44);
  const bx = (i) => m.l + i * banda + (banda - bw) / 2;
  const total = vals.reduce((s, v) => s + v, 0);
  return { W, H, vals, max, tk, py, banda, bw, bx, total };
});
function barra(i) {
  const { bx, bw, py, vals } = g.value;
  const x = bx(i), y = py(vals[i]), h = py(0) - y, r = Math.min(4, h, bw / 2);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${y + h}Z`;
}
const rotulada = (i) => props.rotular === 'todas' || (props.rotular === 'mayor' && g.value.vals[i] === g.value.max);
const tabla = computed(() => ({ columnas: ['', props.etiqueta], filas: props.datos.map((d) => [d[props.x], props.formato(d[props.y])]) }));
const tip = computed(() => {
  const i = hover.value;
  if (i == null) return null;
  const v = g.value.vals[i];
  return { x: g.value.bx(i) + g.value.bw / 2, y: g.value.py(v), titulo: String(props.datos[i][props.x]),
    filas: [{ color: 'var(--serie-1)', nombre: props.etiqueta, valor: props.formato(v) }, { nombre: 'Del total', valor: formatoPorcentaje(v / g.value.total * 100) }] };
});
</script>

<template>
  <GraficoMarco :etiqueta="descripcion" :tabla="tabla">
    <div ref="lienzo">
      <svg :width="g.W" :height="g.H" :class="{ foco: hover != null }" aria-hidden="true">
        <template v-for="t in g.tk" :key="t">
          <line class="g" :x1="m.l" :x2="g.W - m.r" :y1="g.py(t)" :y2="g.py(t)" />
          <text class="ax" :x="m.l - 8" :y="g.py(t) + 4" text-anchor="end">{{ formatoNumero(t) }}</text>
        </template>
        <template v-for="(d, i) in datos" :key="i">
          <path class="dato barra" :class="{ on: hover === i }" :d="barra(i)" />
          <text class="ax cat" :x="g.bx(i) + g.bw / 2" :y="g.H - 8" text-anchor="middle">{{ d[x] }}</text>
          <text v-if="rotulada(i)" class="et" :x="g.bx(i) + g.bw / 2" :y="g.py(g.vals[i]) - 7" text-anchor="middle">{{ formato(g.vals[i]) }}</text>
          <rect :x="m.l + i * g.banda" :y="m.t" :width="g.banda" :height="g.H - m.t - m.b" fill="transparent" @pointerenter="hover = i" @pointerleave="hover = null" />
        </template>
      </svg>
      <GraficoTip v-if="tip" v-bind="tip" :ancho="g.W" />
    </div>
  </GraficoMarco>
</template>

<style scoped>
.barra { fill: var(--serie-1); }
.cat { font-family: var(--mono); font-weight: 700; }
</style>
