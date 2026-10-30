<script setup>
import { computed, ref, useId } from 'vue';
import GraficoMarco from './GraficoMarco.vue';
import GraficoTip from './GraficoTip.vue';
import { colorSerie, formatoPorcentaje, usarAncho } from '../../lib/graficos.js';

// De qué se compone un total: una barra al 100 % por fila, hasta 4 partes en el orden fijo de la paleta.
// Los valores pueden venir crudos; se pasan a porcentaje por fila. Más de 4 partes: agrupar antes en «Otros».
// `resto` nombra la parte que no es un dato principal («Otros», «Sin dato»): va en trama gris, no en color de serie.
const props = defineProps({
  datos: { type: Array, required: true },
  fila: { type: String, required: true },
  partes: { type: Array, required: true },
  descripcion: { type: String, required: true },
  resto: String,
});

const lienzo = ref(null);
const ancho = usarAncho(lienzo);
const alto = 24, sep = 16, m = { t: 4, r: 4, b: 24, l: 90 };
const hover = ref(null);
const uid = useId();

const filas = computed(() => props.datos.map((d) => {
  const vals = props.partes.slice(0, 4).map((p) => d[p] || 0);
  const total = vals.reduce((s, v) => s + v, 0) || 1;
  return { nombre: d[props.fila], pct: vals.map((v) => v / total * 100) };
}));
const g = computed(() => {
  const W = Math.max(ancho.value, 260), util = W - m.l - m.r;
  const H = m.t + filas.value.length * (alto + sep) - sep + m.b;
  const segmentos = filas.value.map((f, r) => {
    let acc = 0;
    return f.pct.map((p, k) => {
      const x = m.l + acc / 100 * util; acc += p;
      return { r, k, x, y: m.t + r * (alto + sep), w: Math.max(0, p / 100 * util - (k < f.pct.length - 1 ? 2 : 0)) };
    });
  });
  return { W, H, util, segmentos };
});
const tabla = computed(() => ({ columnas: ['', ...props.partes.slice(0, 4)], filas: filas.value.map((f) => [f.nombre, ...f.pct.map(formatoPorcentaje)]) }));
const esResto = (k) => props.partes[k] === props.resto;
const leyenda = computed(() => props.partes.slice(0, 4).map((p, k) => ({ nombre: p, color: colorSerie(k), estilo: esResto(k) ? 'trama' : undefined })));
const tip = computed(() => {
  if (!hover.value) return null;
  const { r, k, x, y, w } = hover.value;
  return { x: x + w / 2, y, titulo: String(filas.value[r].nombre), filas: [{ color: esResto(k) ? 'var(--tenue)' : colorSerie(k), nombre: props.partes[k], valor: formatoPorcentaje(filas.value[r].pct[k]) }] };
});
</script>

<template>
  <GraficoMarco :etiqueta="descripcion" :leyenda="leyenda" :tabla="tabla">
    <div ref="lienzo">
      <svg :width="g.W" :height="g.H" :class="{ foco: hover }" aria-hidden="true">
        <defs v-if="resto">
          <pattern :id="`tr-${uid}`" width="5" height="5" patternUnits="userSpaceOnUse"><rect class="trama-linea" width="2" height="5" /></pattern>
        </defs>
        <g v-for="(segs, r) in g.segmentos" :key="r">
          <clipPath :id="`cp-${uid}-${r}`"><rect :x="m.l" :y="m.t + r * (alto + sep)" :width="g.util" :height="alto" rx="4" /></clipPath>
          <text class="ax" :x="m.l - 10" :y="m.t + r * (alto + sep) + alto / 2 + 4" text-anchor="end">{{ filas[r].nombre }}</text>
          <g :clip-path="`url(#cp-${uid}-${r})`">
            <rect v-for="s in segs" :key="s.k" class="dato" :class="{ on: hover === s }" :x="s.x" :y="s.y" :width="s.w" :height="alto"
                  :style="{ fill: esResto(s.k) ? `url(#tr-${uid})` : `var(--serie-${s.k + 1})` }" @pointerenter="hover = s" @pointerleave="hover = null" />
          </g>
        </g>
        <text v-for="p in [0, 50, 100]" :key="p" class="ax" :x="m.l + p / 100 * g.util" :y="g.H - 6" :text-anchor="p === 0 ? 'start' : p === 100 ? 'end' : 'middle'">{{ p }} %</text>
      </svg>
      <GraficoTip v-if="tip" v-bind="tip" :ancho="g.W" />
    </div>
  </GraficoMarco>
</template>

<style scoped>
.trama-linea { fill: var(--trama-color); }
</style>
