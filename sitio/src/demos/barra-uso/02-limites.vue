<script setup>
import { BarraUso } from 'palo-ui-system';
</script>

<template>
  <div class="limites">
    <BarraUso etiqueta="Personas en el plan" :valor="18" :total="25" />
    <BarraUso etiqueta="Espacio de documentos" :valor="41.2" :total="50" unidad=" GB" />
    <BarraUso etiqueta="Envíos a firmar del mes" :valor="512" :total="500" />
  </div>
</template>

<style scoped>
.limites { display: grid; gap: 18px; width: 100%; max-width: 420px; }
</style>
