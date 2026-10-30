<script setup>
import { ref } from 'vue';

// Marco común de los gráficos: leyenda arriba, el dibujo en el medio y «Ver tabla» con los mismos datos.
// leyenda: [{ nombre, color, estilo?: 'linea' | 'rayado' | 'trama' }]. tabla: { columnas: [], filas: [[]] }.
defineProps({ etiqueta: { type: String, required: true }, leyenda: { type: Array, default: () => [] }, tabla: Object });
const verTabla = ref(false);
</script>

<template>
  <figure class="grafico">
    <div class="cab">
      <ul v-if="leyenda.length" class="leyenda">
        <li v-for="l in leyenda" :key="l.nombre"><i :class="l.estilo" :style="{ '--c': l.color }"></i>{{ l.nombre }}</li>
      </ul>
      <span class="relleno"></span>
      <button v-if="tabla" type="button" class="ver" :aria-expanded="verTabla" @click="verTabla = !verTabla">{{ verTabla ? 'Ocultar tabla' : 'Ver tabla' }}</button>
    </div>
    <div class="lienzo" role="img" :aria-label="etiqueta"><slot /></div>
    <div v-if="verTabla && tabla" class="tabla-simple">
      <table>
        <thead><tr><th v-for="c in tabla.columnas" :key="c">{{ c }}</th></tr></thead>
        <tbody><tr v-for="(f, i) in tabla.filas" :key="i"><td v-for="(c, j) in f" :key="j">{{ c }}</td></tr></tbody>
      </table>
    </div>
  </figure>
</template>

<style scoped>
.grafico { margin: 0; display: grid; gap: 10px; min-width: 0; }
.cab { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.leyenda { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0; padding: 0; list-style: none; font-size: .8rem; color: var(--sub); }
.leyenda li { display: inline-flex; align-items: center; gap: 7px; }
.leyenda i { width: 10px; height: 10px; flex: none; border-radius: 2px; background: var(--c); }
.leyenda i.linea { width: 18px; height: 0; border-top: 2px dashed var(--c); border-radius: 0; background: none; }
.leyenda i.trama { background: var(--trama); border-radius: 1px; }
.leyenda i.rayado { width: 12px; height: 12px; background: repeating-linear-gradient(45deg, var(--c) 0 1.5px, transparent 1.5px 4.5px); border: 1.5px solid var(--c); }
.relleno { flex: 1; }
.ver { height: 28px; padding: 0 10px; font-size: .76rem; }
.lienzo { position: relative; min-width: 0; }
.lienzo :deep(svg) { display: block; overflow: visible; touch-action: pan-y; }
.lienzo :deep(.g) { stroke: var(--borde); stroke-width: 1; }
.lienzo :deep(.ax) { fill: var(--sub); font: 500 11px var(--ui); font-variant-numeric: tabular-nums; }
.lienzo :deep(.et) { fill: var(--txt); font: 700 12px var(--mono); }
.lienzo :deep(.lbl) { fill: var(--txt); font: 500 12px var(--ui); }
.lienzo :deep(.cruz) { stroke: var(--borde-fuerte); stroke-width: 1; }
.lienzo :deep(svg.foco .dato:not(.on)) { opacity: .4; }
.tabla-simple table { min-width: 0; }
</style>
