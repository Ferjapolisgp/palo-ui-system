<script setup>
import { ref } from 'vue';
import { DataTable, Interruptor } from 'palo-ui-system';
import { bandeja } from '../../datos/ejemplo.js';

const COLUMNAS = [
  { clave: 'codigo', titulo: 'Código', mono: true, ancho: 96 },
  { clave: 'asunto', titulo: 'Asunto' },
  { clave: 'area', titulo: 'Área' },
  { clave: 'horas', titulo: 'Abierta', alinear: 'derecha', mono: true, formato: (h) => `${h} h` },
];
// Primera carga: todavía no hay filas, así que la tabla muestra filas de carga.
const cargando = ref(true);
const vacia = ref(false);
</script>

<template>
  <div class="estados">
    <div class="controles">
      <Interruptor v-model="cargando">Cargando</Interruptor>
      <Interruptor v-model="vacia">Sin resultados</Interruptor>
    </div>
    <DataTable :columnas="COLUMNAS" :filas="cargando || vacia ? [] : bandeja.slice(0, 4)" titulo="Solicitudes del área" clave-fila="codigo" :cargando="cargando" :filas-carga="4"
               :vacio="{ titulo: 'Ninguna solicitud vencida', texto: 'Cuando una pase su plazo va a aparecer acá.' }" />
  </div>
</template>

<style scoped>
.estados { display: grid; gap: 12px; width: 100%; min-width: 0; }
.controles { display: flex; flex-wrap: wrap; gap: 20px; }
</style>
