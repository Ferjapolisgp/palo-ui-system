<script setup>
import { Aviso } from 'palo-ui-system';
</script>

<template>
  <div class="avisos">
    <Aviso titulo="Info">El mantenimiento programado es el domingo de 2 a 4 h.</Aviso>
    <Aviso tono="aviso" titulo="Aviso">9 solicitudes vencen hoy y no tienen responsable.</Aviso>
    <Aviso tono="error" titulo="Error">No se pudieron subir 3 documentos: superan los 20 MB. Comprimilos y probá de nuevo.</Aviso>
    <Aviso tono="ok" titulo="Listo">El alta de Julián Paz quedó completa.</Aviso>
  </div>
</template>

<style scoped>
.avisos { display: grid; gap: 8px; width: 100%; }
</style>
