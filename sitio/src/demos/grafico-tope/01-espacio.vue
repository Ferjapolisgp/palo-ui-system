<script setup>
import { GraficoTope } from 'palo-ui-system';
import { espacios } from '../../datos/ejemplo.js';

const gb = (v) => `${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })} GB`;
</script>

<template>
  <GraficoTope :filas="espacios" nombre="area" detalle="detalle" valor="usado" limite="cuota" :formato="gb"
               descripcion="Espacio usado por tres áreas en Docs contra su cuota de 50 GB" style="width: 100%" />
</template>
