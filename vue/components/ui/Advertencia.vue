<script setup>
// Banda de advertencia: texto estampado entre dos franjas, como la cinta de precaución de una calca.
// Para lo que ya venció o está por vencer, no para estados comunes (eso es .tag). El texto dice qué pasa
// y cuándo («Vencido hace 18 h»): el color y las franjas solo lo refuerzan.
// tono: 'error' (vencido, bloqueado) | 'aviso' (por vencer). `bloque` la estira al ancho disponible.
defineProps({
  tono: { type: String, default: 'error', validator: (v) => ['error', 'aviso'].includes(v) },
  bloque: Boolean,
});
</script>

<template>
  <span class="advertencia" :class="[tono, { bloque }]"><i aria-hidden="true" /><span><slot /></span><i aria-hidden="true" /></span>
</template>

<style scoped>
.advertencia { --c: var(--error); max-width: 100%; display: inline-flex; align-items: stretch; height: 22px; border: 1.5px solid var(--c); border-radius: var(--r-sm); background: color-mix(in srgb, var(--c) 10%, transparent); color: color-mix(in srgb, var(--c) 80%, var(--txt)); white-space: nowrap; vertical-align: middle; }
.advertencia.aviso { --c: var(--aviso); }
.advertencia.bloque { display: flex; }
.advertencia > i { width: 18px; flex: none; background: repeating-linear-gradient(-60deg, var(--c) 0 3px, transparent 3px 7px); }
.advertencia > span { flex: 1; min-width: 0; display: grid; place-items: center; padding: 0 10px; overflow: hidden; text-overflow: ellipsis; font: 700 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; }
</style>
