<script setup>
import { ref } from 'vue';
import { Desplegable } from 'palo-ui-system';
import { estadosSolicitud } from '../../datos/ejemplo.js';

const estado = ref('');
const area = ref('docs');
</script>

<template>
  <div class="filtros">
    <Desplegable v-model="estado" etiqueta="Estado" :opciones="estadosSolicitud" />
    <Desplegable v-model="area" etiqueta="Área" :opciones="[
      { valor: '', texto: 'Todas' },
      { valor: 'pay', texto: 'Pay' },
      { valor: 'docs', texto: 'Docs' },
      { valor: 'onboarding', texto: 'Onboarding' },
    ]" />
  </div>
</template>

<style scoped>
.filtros { display: flex; flex-wrap: wrap; gap: 8px; min-height: 220px; align-items: flex-start; }
</style>
