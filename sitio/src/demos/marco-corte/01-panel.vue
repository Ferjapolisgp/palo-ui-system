<script setup>
import { Indicador } from 'palo-ui-system';
import { fechaLarga, ultimos14 } from '../../datos/ejemplo.js';

const dias = ultimos14.map((d) => fechaLarga(d.fecha));
// «Sin clasificar» es el resto: va en trama, no en color de serie.
const origen = [{ nombre: 'Subidos', valor: 50.6 }, { nombre: 'Generados', valor: 31.7 }, { nombre: 'Sin clasificar', valor: 17.7, resto: true }];
</script>

<template>
  <div class="fila">
    <!-- El Indicador recorta su contenido (overflow: hidden): el marco va en un contenedor de afuera. -->
    <div class="marco-corte"><Indicador etiqueta="Ingresadas hoy" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer"
               :tendencia="ultimos14.map((d) => d.cantidad)" :etiquetas-tendencia="dias" /></div>
    <div class="marco-corte"><Indicador etiqueta="Documentos clasificados" valor="82,3 %" variacion="▲ 1,9 puntos este mes" tono="ok"
               forma="composicion" grafico="solido" :partes="origen" /></div>
  </div>
</template>

<style scoped>
.fila { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; width: 100%; padding: 22px; }
.fila > * { display: grid; min-height: 160px; }
</style>
