<script setup>
import { computed } from 'vue';
import Advertencia from './Advertencia.vue';
import { bandaAdvertencia } from '../../lib/visual.js';

// Advertencia de un ticket. Solo existe para urgentes vencidos (rojo) o que vencen en 24 h (naranja);
// en cualquier otro caso no dibuja nada.
const props = defineProps({ ticket: { type: Object, required: true }, bloque: Boolean });
const banda = computed(() => bandaAdvertencia(props.ticket));
</script>

<template>
  <Advertencia v-if="banda" :tono="banda.nivel" :bloque="bloque" role="status">{{ banda.texto }}</Advertencia>
</template>
