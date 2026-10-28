<script setup>
// El código es PREFIJO-NNNN en mono extra bold, sin caja ni color propio; los confidenciales llevan LOCK a la derecha.
defineProps({ ticket: Object, grande: Boolean });
</script>

<template>
  <span class="cod-ticket" :class="{ grande }" :title="ticket.tipo_etiqueta">{{ ticket.codigo }}<span v-if="ticket.confidencial" class="lock" title="Confidencial">LOCK</span></span>
</template>

<style scoped>
.cod-ticket { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font: 800 .78rem var(--mono); letter-spacing: .05em; color: var(--txt); }
.cod-ticket.grande { font-size: 1rem; }
.lock { font: 700 .6rem var(--mono); letter-spacing: .12em; color: var(--sub); }
</style>
