<script setup>
// Logo: «TK» en el cuadro amarillo con esquinas marcadas, y el nombre con la serie debajo.
defineProps({ serie: { type: String, default: 'SERIE 01 · SGSI' }, grande: Boolean });
</script>

<template>
  <span class="marca" :class="{ grande }">
    <span class="ico">TK</span>
    <span class="txt"><b>TICKETERA</b><small v-if="serie">{{ serie }}</small></span>
  </span>
</template>

<style scoped>
.marca { display: inline-flex; align-items: center; gap: 10px; color: var(--txt); }
.ico { position: relative; width: 30px; height: 30px; display: grid; place-items: center; background: var(--senal); color: var(--senal-txt); border-radius: var(--r-sm); font: 800 .75rem var(--mono); flex: none; }
.ico::before, .ico::after { content: ""; position: absolute; width: 7px; height: 7px; border: 2px solid var(--marco, var(--panel)); }
.ico::before { top: -3px; left: -3px; border-right: 0; border-bottom: 0; }
.ico::after { bottom: -3px; right: -3px; border-left: 0; border-top: 0; }
b { display: block; font-weight: 800; letter-spacing: .18em; font-size: .8rem; }
small { white-space: nowrap; font: 500 .62rem var(--mono); letter-spacing: .08em; color: var(--sub); }
.grande .ico { width: 40px; height: 40px; font-size: 1rem; }
.grande b { font-size: 1rem; }
</style>
