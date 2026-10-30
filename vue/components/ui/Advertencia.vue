<script setup>
// Banda de advertencia: texto estampado entre dos franjas, como la cinta de precaución de una calca.
// Para lo que ya venció o está por vencer, no para estados comunes (eso es .tag). El texto dice qué pasa
// y cuándo («Vencido hace 18 h»): el color y las franjas solo lo refuerzan.
// tono: 'error' (vencido, bloqueado) | 'aviso' (por vencer). `bloque` la estira al ancho disponible.
// Franjas según el tono: error con rayas en espejo (/// texto \\\), aviso con cheurones (>>> texto <<<).
// `animada` las hace entrar desde afuera hacia el texto, como una cinta en movimiento: solo para lo que pide
// acción ya; con «reducir movimiento» quedan quietas.
defineProps({
  tono: { type: String, default: 'error', validator: (v) => ['error', 'aviso'].includes(v) },
  bloque: Boolean,
  animada: Boolean,
});
</script>

<template>
  <span class="advertencia" :class="[`tono-${tono}`, { bloque, 'advertencia-animada': animada }]"><i aria-hidden="true" /><span><slot /></span><i aria-hidden="true" /></span>
</template>

<style scoped>
.advertencia { --c: var(--error); max-width: 100%; display: inline-flex; align-items: stretch; height: 22px; border: 1.5px solid var(--c); border-radius: var(--r-sm); background: color-mix(in srgb, var(--c) 10%, transparent); color: color-mix(in srgb, var(--c) 80%, var(--txt)); white-space: nowrap; vertical-align: middle; }
.advertencia.tono-aviso { --c: var(--aviso); }
.advertencia.bloque { display: flex; }
/* Franjas: la forma y el tamaño dependen solo del tono; `animada` solo agrega el movimiento.
   Baldosas cuadradas de media altura (9,5 px): correr una baldosa entera da un loop sin salto. */
.advertencia > i { --paso: 9.5px; --a: linear-gradient(45deg, var(--c) 25%, transparent 25% 50%, var(--c) 50% 75%, transparent 75%);
  --b: linear-gradient(135deg, var(--c) 25%, transparent 25% 50%, var(--c) 50% 75%, transparent 75%); width: 30px; flex: none; }
/* Error: rayas en espejo, «/» a la izquierda y «\» a la derecha */
.advertencia.tono-error > i { background: var(--b) 0 0 / var(--paso) var(--paso); }
.advertencia.tono-error > i:last-child { background: var(--a) 0 0 / var(--paso) var(--paso); }
/* Aviso: cheurones que apuntan al texto (>>> y <<<); cada uno es una raya «\» arriba y una «/» abajo */
.advertencia.tono-aviso > i { background: var(--a) 0 0 / var(--paso) 50% repeat-x, var(--b) 0 100% / var(--paso) 50% repeat-x; }
.advertencia.tono-aviso > i:last-child { background: var(--b) 0 0 / var(--paso) 50% repeat-x, var(--a) 0 100% / var(--paso) 50% repeat-x; }
/* Animada: las franjas entran desde los bordes hacia el texto */
.advertencia-animada > i { animation: entra-izq .45s linear infinite; }
.advertencia-animada > i:last-child { animation-name: entra-der; }
@keyframes entra-izq { to { background-position: var(--paso) 0, var(--paso) 100%; } }
@keyframes entra-der { to { background-position: calc(-1 * var(--paso)) 0, calc(-1 * var(--paso)) 100%; } }
@media (prefers-reduced-motion: reduce) { .advertencia-animada > i { animation: none; } }
.advertencia > span { flex: 1; min-width: 0; display: grid; place-items: center; padding: 0 10px; overflow: hidden; text-overflow: ellipsis; font: 700 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; }
</style>
