<script setup>
import { GrillaCupos } from 'palo-ui-system';
</script>

<template>
  <div class="fila">
    <div><p class="etiqueta-seccion">Licencias de firma · 11 de 16</p><GrillaCupos :usados="11" :total="16" etiqueta="Licencias de firma en uso" /></div>
    <div><p class="etiqueta-seccion">Puestos de soporte · 3 de 24</p><GrillaCupos :usados="3" :total="24" :columnas="12" etiqueta="Puestos de soporte" /></div>
  </div>
</template>

<style scoped>
.fila { display: flex; flex-wrap: wrap; gap: 32px; }
.fila > div { display: grid; gap: 10px; }
</style>
