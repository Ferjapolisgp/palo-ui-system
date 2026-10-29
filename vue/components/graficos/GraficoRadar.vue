<script setup>
import { computed, ref, useId } from 'vue';
import GraficoMarco from './GraficoMarco.vue';
import GraficoTip from './GraficoTip.vue';
import { colorSerie, formatoNumero, posicion, usarAncho } from '../../lib/graficos.js';

// Perfil en 5 o 6 dimensiones de la misma escala. Hasta 2 series: la principal rayada a 45°
// (estilo «rayado») y la referencia en línea punteada (estilo «linea»). Al acercar el puntero a un eje
// se ven los valores de las dos.
const props = defineProps({
  ejes: { type: Array, required: true },
  series: { type: Array, required: true },
  maximo: { type: Number, default: 100 },
  descripcion: { type: String, required: true },
  formato: { type: Function, default: formatoNumero },
});

const lienzo = ref(null);
const svg = ref(null);
const ancho = usarAncho(lienzo);
const rayado = `rayado-${useId()}`;
const eje = ref(null);

const g = computed(() => {
  const W = Math.max(ancho.value, 280), H = W < 480 ? 300 : 380, n = props.ejes.length;
  const R = Math.max(60, Math.min(H / 2 - 34, W / 2 - 110)), cx = W / 2, cy = H / 2;
  const ang = (k) => -Math.PI / 2 + k * 2 * Math.PI / n;
  const pt = (k, v) => [cx + Math.cos(ang(k)) * R * v / props.maximo, cy + Math.sin(ang(k)) * R * v / props.maximo];
  return { W, H, n, R, cx, cy, ang, pt };
});
const series = computed(() => props.series.slice(0, 2).map((s, i) => ({ ...s, color: colorSerie(i), estilo: s.estilo || (i === 0 ? 'rayado' : 'linea'),
  puntos: s.valores.map((v, k) => g.value.pt(k, v)) })));
const poligono = (s) => s.puntos.map((p) => p.map((c) => c.toFixed(1)).join(',')).join(' ');
function rotulo(k) {
  const { ang, cx, cy, R } = g.value, c = Math.cos(ang(k)), s = Math.sin(ang(k));
  return { x: cx + c * (R + 14), y: cy + s * (R + 14) + (s < -0.5 ? -4 : s > 0.5 ? 14 : 4), anchor: c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle' };
}
function mover(e) {
  const { cx, cy, R, n, ang } = g.value;
  const [px, py] = posicion(e, svg.value), dx = px - cx, dy = py - cy;
  if (Math.hypot(dx, dy) > R + 50) { eje.value = null; return; }
  const a = Math.atan2(dy, dx);
  let mejor = 9;
  for (let k = 0; k < n; k++) {
    const d = Math.abs(Math.atan2(Math.sin(a - ang(k)), Math.cos(a - ang(k))));
    if (d < mejor) { mejor = d; eje.value = k; }
  }
}
const leyenda = computed(() => series.value.map((s) => ({ nombre: s.nombre, color: s.color, estilo: s.estilo })));
const tabla = computed(() => ({ columnas: ['', ...series.value.map((s) => s.nombre)], filas: props.ejes.map((e, k) => [e, ...series.value.map((s) => props.formato(s.valores[k]))]) }));
const tip = computed(() => {
  const k = eje.value;
  if (k == null) return null;
  const [x, y] = g.value.pt(k, Math.max(...series.value.map((s) => s.valores[k])));
  return { x, y, titulo: props.ejes[k], filas: series.value.map((s) => ({ color: s.color, nombre: s.nombre, valor: props.formato(s.valores[k]) })) };
});
</script>

<template>
  <GraficoMarco :etiqueta="descripcion" :leyenda="leyenda" :tabla="tabla">
    <div ref="lienzo">
      <svg ref="svg" :width="g.W" :height="g.H" aria-hidden="true" @pointermove="mover" @pointerleave="eje = null">
        <defs>
          <pattern v-for="(s, i) in series" :id="`${rayado}-${i}`" :key="i" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" :style="{ stroke: s.color, strokeWidth: 1.5 }" />
          </pattern>
        </defs>
        <circle v-for="t in [25, 50, 75, 100]" :key="t" class="anillo" :cx="g.cx" :cy="g.cy" :r="g.R * t / 100" />
        <line v-for="(e, k) in ejes" :key="e" class="eje" :class="{ on: eje === k }" :x1="g.cx" :y1="g.cy" :x2="g.pt(k, maximo)[0]" :y2="g.pt(k, maximo)[1]" />
        <text v-for="t in [50, 100]" :key="'t' + t" class="ax" :x="g.cx + 4" :y="g.cy - g.R * t / 100 - 4">{{ formato(maximo * t / 100) }}</text>
        <polygon v-for="(s, i) in series" :key="s.nombre" :points="poligono(s)" class="serie"
                 :style="{ stroke: s.color, fill: s.estilo === 'rayado' ? `url(#${rayado}-${i})` : 'none', strokeDasharray: s.estilo === 'linea' ? '5 4' : 'none' }" />
        <template v-for="s in series" :key="'p' + s.nombre">
          <circle v-for="(p, k) in s.puntos" :key="k" class="vertice" :cx="p[0]" :cy="p[1]" r="4" :style="{ fill: s.color }" />
        </template>
        <text v-for="(e, k) in ejes" :key="'r' + e" class="lbl" :x="rotulo(k).x" :y="rotulo(k).y" :text-anchor="rotulo(k).anchor">{{ e }}</text>
      </svg>
      <GraficoTip v-if="tip" v-bind="tip" :ancho="g.W" />
    </div>
  </GraficoMarco>
</template>

<style scoped>
.anillo { fill: none; stroke: var(--borde); }
.eje { stroke: var(--borde); }
.eje.on { stroke: var(--sub); stroke-width: 1.5; }
.serie { stroke-width: 2; stroke-linejoin: round; }
.vertice { stroke: var(--bg); stroke-width: 2; }
</style>
