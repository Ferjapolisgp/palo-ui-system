<script setup>
import { ref } from 'vue';
import { Pasos } from 'palo-ui-system';

const actual = ref('documentos');
// Datos de ejemplo
const pasos = [
  { valor: 'datos', texto: 'Datos', detalle: 'Razón social y CUIT' },
  { valor: 'documentos', texto: 'Documentos', detalle: 'Constancia y estatuto' },
  { valor: 'revision', texto: 'Revisión', detalle: 'Hasta 48 h' },
  { valor: 'alta', texto: 'Alta' },
];
</script>

<template>
  <div class="todo">
    <Pasos :pasos="pasos" :actual="actual" navegable @elegir="(p) => (actual = p.valor)" />
    <Pasos :pasos="[{ valor: 'a', texto: 'Cargar el archivo', estado: 'hecho' }, { valor: 'b', texto: 'Validar importes', detalle: '3 filas con error. Corregilas y probá de nuevo.', estado: 'error' }, { valor: 'c', texto: 'Enviar a firmar', estado: 'pendiente' }]" orientacion="vertical" />
    <div class="acciones"><button type="button" @click="actual = 'datos'">Volver al inicio</button></div>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 22px; width: 100%; }
.acciones { display: flex; gap: 8px; }
</style>
