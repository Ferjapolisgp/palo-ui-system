<script setup>
// Mensaje en línea. Cada tono tiene su forma (círculo, triángulo, rombo, cuadrado) para no depender solo del color.
defineProps({ tono: { type: String, default: 'info' }, titulo: String });
</script>

<template>
  <div class="aviso" :class="tono" :role="tono === 'error' ? 'alert' : undefined">
    <span><b v-if="titulo">{{ titulo }}</b><slot /></span>
  </div>
</template>

<style scoped>
.aviso { --c: var(--info); display: flex; gap: 10px; align-items: flex-start; padding: 9px 12px; font-size: .86rem; border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); border-radius: var(--r-md); background: color-mix(in srgb, var(--c) 9%, transparent); }
.aviso::before { content: ""; flex: none; width: 8px; height: 8px; margin-top: 6px; background: var(--c); border-radius: 50%; }
.aviso.aviso { --c: var(--aviso); }
.aviso.aviso::before { width: 10px; border-radius: 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.aviso.error { --c: var(--error); }
.aviso.error::before { border-radius: 0; transform: rotate(45deg); }
.aviso.ok { --c: var(--ok); }
.aviso.ok::before { border-radius: 1px; }
b { margin-right: 6px; font: 800 .68rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: color-mix(in srgb, var(--c) 75%, var(--txt)); }
</style>
