<script setup>
// Indicador de carga en línea, para un botón o un texto («Guardando…»). Hereda el color del texto.
// Dentro de un botón que ya dice qué pasa, va con etiqueta vacía para no anunciarlo dos veces.
defineProps({ tam: { type: Number, default: 16 }, etiqueta: { type: String, default: 'Cargando…' } });
</script>

<template>
  <span class="spin" :role="etiqueta ? 'status' : undefined" :style="{ width: tam + 'px', height: tam + 'px' }">
    <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" /></svg>
    <span v-if="etiqueta" class="oculto">{{ etiqueta }}</span>
  </span>
</template>

<style scoped>
.spin { display: inline-block; flex: none; vertical-align: -.15em; }
svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; animation: giro .8s linear infinite; }
circle { opacity: .25; }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@keyframes giro { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { svg { animation-duration: 2.4s; } }
</style>
