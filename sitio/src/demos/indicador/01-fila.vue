<script setup>
import { Indicador } from 'palo-ui-system';
import { altas14, fechaLarga, ultimos14, vencidas14 } from '../../datos/ejemplo.js';

const dias = ultimos14.map((d) => fechaLarga(d.fecha));
</script>

<template>
  <div class="fila">
    <Indicador etiqueta="Ingresadas hoy" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer"
               :tendencia="ultimos14.map((d) => d.cantidad)" :etiquetas-tendencia="dias" />
    <Indicador etiqueta="Vencidas" valor="9" variacion="▼ 6 en dos semanas" tono="ok" :tendencia="vencidas14" :etiquetas-tendencia="dias" />
    <Indicador etiqueta="Primera respuesta" valor="2 h 40 min" variacion="▲ 25 min sobre el objetivo" tono="aviso" />
    <Indicador etiqueta="Altas completas por día" valor="7" variacion="▼ 1 contra ayer" :tendencia="altas14" :etiquetas-tendencia="dias" />
  </div>
</template>

<style scoped>
.fila { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; width: 100%; }
</style>
