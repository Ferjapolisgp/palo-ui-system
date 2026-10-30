<script setup>
import { ref } from 'vue';
import { DataTable } from 'palo-ui-system';
import { bandeja } from '../../datos/ejemplo.js';

const CANALES = ['Web', 'Mail', 'WhatsApp', 'Teléfono'];
const filas = bandeja.map((s, i) => ({ ...s, canal: CANALES[i % 4], creada: `${20 + (i % 9)}/10 ${String(8 + (i % 10)).padStart(2, '0')}:${i % 2 ? '30' : '05'}`, respuestas: (i * 3) % 7 }));
const COLUMNAS = [
  { clave: 'codigo', titulo: 'Código', mono: true, fija: true, ordenable: true },
  { clave: 'asunto', titulo: 'Asunto', ordenable: true },
  { clave: 'solicitante', titulo: 'Solicitante', ordenable: true },
  { clave: 'responsable', titulo: 'Responsable', ordenable: true },
  { clave: 'area', titulo: 'Área' },
  { clave: 'canal', titulo: 'Canal' },
  { clave: 'creada', titulo: 'Creada', mono: true },
  { clave: 'respuestas', titulo: 'Respuestas', alinear: 'derecha', mono: true, ordenable: true },
  { clave: 'horas', titulo: 'Abierta', alinear: 'derecha', mono: true, ordenable: true, formato: (h) => `${h} h` },
  { clave: 'estado', titulo: 'Estado' },
];
const orden = ref(null);
const seleccion = ref([]);
</script>

<template>
  <DataTable v-model:orden="orden" v-model:seleccion="seleccion" :columnas="COLUMNAS" :filas="filas" titulo="Todas las solicitudes" clave-fila="codigo"
             orden-local seleccionable compacta :alto="320">
    <template #celda-responsable="{ valor }"><span :class="{ sub: !valor }">{{ valor || 'Sin asignar' }}</span></template>
    <template #celda-estado="{ fila }"><span class="tag" :class="fila.tono">{{ fila.estado }}</span></template>
  </DataTable>
</template>
