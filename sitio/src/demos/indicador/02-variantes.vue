<script setup>
import { Indicador } from 'palo-ui-system';
import { fechaLarga, ultimos14 } from '../../datos/ejemplo.js';

const dias = ultimos14.map((d) => fechaLarga(d.fecha));
const tendencia = ultimos14.map((d) => d.cantidad);
</script>

<template>
  <div class="fila">
    <Indicador etiqueta="Ingresadas hoy · degradé" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer"
               :tendencia="tendencia" :etiquetas-tendencia="dias" />
    <Indicador etiqueta="Ingresadas hoy · sólido" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer"
               :tendencia="tendencia" :etiquetas-tendencia="dias" grafico="solido" />
  </div>
</template>

<style scoped>
.fila { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; width: 100%; }
.fila > * { min-height: 150px; }
</style>
