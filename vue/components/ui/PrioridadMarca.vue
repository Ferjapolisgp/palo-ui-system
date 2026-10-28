<script setup>
// Prioridad con forma y texto: ▲ urgente, » alta. Nunca depende solo del color.
defineProps({ prioridad: { type: String, required: true } });
</script>

<template>
  <span class="prio" :class="prioridad">
    <svg v-if="prioridad === 'urgente'" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1 11.5 11h-11z" /></svg>
    <svg v-else-if="prioridad === 'alta'" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 2l4 4-4 4V2zm5 0 4 4-4 4V2z" /></svg>
    {{ prioridad }}
  </span>
</template>

<style scoped>
.prio { display: inline-flex; align-items: center; gap: 5px; font: 600 .69rem var(--mono); letter-spacing: .06em; text-transform: uppercase; }
.prio svg { width: 12px; height: 12px; fill: currentColor; }
.urgente { color: var(--error); }
.alta { color: var(--aviso); }
.normal { color: var(--sub); }
.baja { color: var(--tenue); }
</style>
