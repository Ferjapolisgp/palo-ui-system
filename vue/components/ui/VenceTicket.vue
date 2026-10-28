<script setup>
import { computed } from 'vue';
import { bandaAdvertencia } from '../../lib/visual.js';
import BandaAdvertencia from './BandaAdvertencia.vue';
import MedidorFlujo from './MedidorFlujo.vue';

// Celda "Vence": la banda de advertencia si el ticket la merece y, si no, el medidor de flujo.
const props = defineProps({ ticket: { type: Object, required: true }, ruta: Array, paso: Number, bloque: Boolean });
const conBanda = computed(() => !!bandaAdvertencia(props.ticket));
</script>

<template>
  <BandaAdvertencia v-if="conBanda" :ticket="ticket" :bloque="bloque" />
  <MedidorFlujo v-else :ticket="ticket" v-bind="{ ...(ruta && { ruta }), ...(paso && { paso }) }" />
</template>
