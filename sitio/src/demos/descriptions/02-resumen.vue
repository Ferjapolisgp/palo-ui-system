<script setup>
import { Descriptions } from 'palo-ui-system';

const resumen = [
  { termino: 'Plazo del área', valor: '48 h hábiles' },
  { termino: 'Vence', valor: 'jue 30/10 · 14:00', mono: true },
  { termino: 'Prioridad', valor: 'Alta' },
];
</script>

<template>
  <Descriptions :items="resumen" :columnas="3" etiqueta-arriba class="resumen" />
</template>

<style scoped>
.resumen { width: 100%; }
</style>
