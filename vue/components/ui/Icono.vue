<script setup>
import { computed } from 'vue';
import { ICONOS } from '../../lib/iconos.js';

// Ícono de trazo que hereda el color del texto. Es decorativo: lo nombra el texto de al lado o el aria-label del botón.
const props = defineProps({ nombre: { type: String, required: true }, tam: { type: Number, default: 18 } });
const trazo = computed(() => ICONOS[props.nombre] || '');
</script>

<template>
  <svg class="icono-svg" :width="tam" :height="tam" viewBox="0 0 24 24" aria-hidden="true" v-html="trazo" />
</template>

<style scoped>
.icono-svg { flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>
