<script setup>
import { computed } from 'vue';
import { bandaAdvertencia } from '../../lib/visual.js';

// Banda con franjas en los extremos. Solo existe para urgentes vencidos (rojo) o que vencen en 24 h (naranja);
// en cualquier otro caso no dibuja nada.
const props = defineProps({ ticket: { type: Object, required: true }, bloque: Boolean });
const banda = computed(() => bandaAdvertencia(props.ticket));
</script>

<template>
  <span v-if="banda" class="banda" :class="[banda.nivel, { bloque }]" role="status"><i /><span>{{ banda.texto }}</span><i /></span>
</template>

<style scoped>
.banda { --c: var(--error); max-width: 100%; display: inline-flex; align-items: stretch; height: 22px; border: 1.5px solid var(--c); border-radius: var(--r-sm); color: var(--c); white-space: nowrap; }
.banda.aviso { --c: var(--aviso); }
.banda.bloque { display: flex; }
.banda > i { width: 20px; flex: none; background: repeating-linear-gradient(-60deg, var(--c) 0 4px, transparent 4px 8px); }
.banda > span { flex: 1; min-width: 0; display: grid; place-items: center; padding: 0 10px; overflow: hidden; text-overflow: ellipsis; font: 700 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; }
</style>
