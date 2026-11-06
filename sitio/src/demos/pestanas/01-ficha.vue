<script setup>
import { ref } from 'vue';
import { Pestanas } from 'palo-ui-system';

const activa = ref('resumen');
// Datos de ejemplo
const items = [
  { valor: 'resumen', texto: 'Resumen' },
  { valor: 'archivos', texto: 'Archivos', contador: 4 },
  { valor: 'comentarios', texto: 'Comentarios', contador: 12 },
  { valor: 'auditoria', texto: 'Auditoría', deshabilitada: true },
];
</script>

<template>
  <Pestanas v-model="activa" :items="items" etiqueta="Secciones de la solicitud">
    <template #resumen><p class="sub">Datos principales de la solicitud TK-1042.</p></template>
    <template #archivos><p class="sub">Cuatro archivos adjuntos de ejemplo.</p></template>
    <template #comentarios><p class="sub">Doce comentarios de ejemplo.</p></template>
  </Pestanas>
</template>

<style scoped>
.sub { margin: 0; color: var(--sub); }
</style>
