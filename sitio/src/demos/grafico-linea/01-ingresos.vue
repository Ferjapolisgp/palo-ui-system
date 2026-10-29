<script setup>
import { GraficoLinea } from 'palo-ui-system';
import { fechaCorta, ingresos } from '../../datos/ejemplo.js';
</script>

<template>
  <GraficoLinea :datos="ingresos" x="fecha" y="cantidad" etiqueta="Ingresadas" :formato-x="fechaCorta"
                descripcion="Solicitudes ingresadas por día durante los últimos 30 días, entre 15 y 60" style="width: 100%" />
</template>
