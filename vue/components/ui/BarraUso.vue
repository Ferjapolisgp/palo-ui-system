<script setup>
import { computed } from 'vue';
import { formatoNumero } from '../../lib/graficos.js';

// Medidor fino de cuánto se usa de algo: etiqueta a la izquierda, «usado / total» a la derecha y la barra debajo.
// Sin `total`, `valor` es un porcentaje. Pasa a aviso y a error por umbral; el valor siempre va escrito.
const props = defineProps({
  etiqueta: { type: String, required: true },
  valor: { type: Number, required: true },
  total: Number,
  unidad: { type: String, default: '' },
  formato: { type: Function, default: formatoNumero },
  avisoDesde: { type: Number, default: 80 },
  errorDesde: { type: Number, default: 95 },
});

const porcentaje = computed(() => Math.max(0, Math.min(100, props.total ? props.valor / props.total * 100 : props.valor)));
const tono = computed(() => porcentaje.value >= props.errorDesde ? 'tono-error' : porcentaje.value >= props.avisoDesde ? 'tono-aviso' : '');
const texto = (n) => `${props.formato(n)}${props.unidad}`;
const leido = computed(() => props.total ? `${texto(props.valor)} de ${texto(props.total)}` : `${Math.round(porcentaje.value)} %`);
</script>

<template>
  <div class="uso" :class="tono" role="meter" :aria-label="etiqueta" aria-valuemin="0" aria-valuemax="100"
       :aria-valuenow="Math.round(porcentaje)" :aria-valuetext="leido">
    <div class="linea">
      <span class="et">{{ etiqueta }}</span>
      <span v-if="total" class="val">{{ texto(valor) }}<small> / {{ texto(total) }}</small></span>
      <span v-else class="val">{{ Math.round(porcentaje) }} %</span>
    </div>
    <div class="barra"><i :style="{ width: porcentaje + '%' }"></i></div>
  </div>
</template>

<style scoped>
.uso { display: grid; gap: 6px; min-width: 0; }
.linea { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.et { font: 600 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--txt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val { font: 700 .72rem var(--mono); white-space: nowrap; }
.val small { font: inherit; font-weight: 500; color: var(--tenue); }
.barra { height: 6px; overflow: hidden; background: var(--borde); border-radius: 1px; }
.barra i { display: block; height: 100%; background: var(--txt); transition: width .3s; }
.tono-aviso .barra i { background: var(--aviso); }
.tono-error .barra i { background: var(--error); }
.tono-error .val { color: var(--error); }
@media (prefers-reduced-motion: reduce) { .barra i { transition: none; } }
</style>
