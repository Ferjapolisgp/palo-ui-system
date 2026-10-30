<script setup>
import { Icono, ICONOS } from 'palo-ui-system';
</script>

<template>
  <ul class="galeria">
    <li v-for="nombre in Object.keys(ICONOS)" :key="nombre"><Icono :nombre="nombre" :tam="20" /><code>{{ nombre }}</code></li>
  </ul>
</template>

<style scoped>
.galeria { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; width: 100%; margin: 0; padding: 0; list-style: none; }
li { display: grid; justify-items: center; gap: 8px; padding: 14px 6px; border: 1px solid var(--borde); border-radius: var(--r-md); background: var(--panel); color: var(--txt); }
code { font: 500 .7rem var(--mono); color: var(--sub); background: none; border: 0; }
</style>
