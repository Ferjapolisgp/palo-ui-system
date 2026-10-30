<script setup>
import { ref } from 'vue';
import { Indicador, Interruptor } from 'palo-ui-system';
import { altas14, canalesPorMes, fechaLarga, ultimos14 } from '../../datos/ejemplo.js';

const solido = ref(false);
const dias = ultimos14.map((d) => fechaLarga(d.fecha));
const octubre = canalesPorMes.at(-1);
const canales = ['Web', 'Mail', 'WhatsApp', 'Teléfono'].map((nombre) => ({ nombre, valor: octubre[nombre] }));
const gb = (v) => `${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })} GB`;
</script>

<template>
  <div class="demo-formas">
    <Interruptor v-model="solido">Color sólido</Interruptor>
    <div class="fila">
      <Indicador etiqueta="Ingresadas hoy" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer"
                 forma="linea" :grafico="solido ? 'solido' : 'degrade'" :tendencia="ultimos14.map((d) => d.cantidad)" :etiquetas-tendencia="dias" />
      <Indicador etiqueta="Altas completas" valor="7" variacion="▼ 1 contra ayer"
                 forma="barras" :grafico="solido ? 'solido' : 'degrade'" :tendencia="altas14" :etiquetas-tendencia="dias" />
      <Indicador etiqueta="Canal de ingreso" valor="45 % web" variacion="▲ 2 puntos contra septiembre" tono="ok"
                 forma="composicion" :grafico="solido ? 'solido' : 'degrade'" :partes="canales" />
      <Indicador etiqueta="Espacio en Docs" :valor="gb(44.6)" variacion="▲ 3,1 GB este mes" tono="aviso"
                 forma="tope" :grafico="solido ? 'solido' : 'degrade'" :usado="44.6" :limite="50" :formato="gb" />
    </div>
  </div>
</template>

<style scoped>
.demo-formas { display: grid; gap: 14px; width: 100%; }
.fila { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
.fila > * { min-height: 150px; }
</style>
