<script setup>
import { computed, ref } from 'vue';
import { DatePicker, formatoFecha, hoyIso, sumarDias } from 'palo-ui-system';

const periodo = ref([sumarDias(hoyIso(), -6), hoyIso()]);
const texto = computed(() => (periodo.value?.[0] && periodo.value?.[1] ? `${formatoFecha(periodo.value[0])} al ${formatoFecha(periodo.value[1])}` : 'Sin período'));
</script>

<template>
  <div class="filtro">
    <span class="et">Período</span>
    <DatePicker v-model="periodo" rango etiqueta="Período" :max="hoyIso()" class="selector" />
    <span class="sub resumen">{{ texto }} · <code>{{ JSON.stringify(periodo) }}</code></span>
  </div>
</template>

<style scoped>
.filtro { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; }
.et { font: 600 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); }
.selector { width: 290px; max-width: 100%; }
.resumen { font-size: .84rem; }
</style>
