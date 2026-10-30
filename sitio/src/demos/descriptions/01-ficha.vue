<script setup>
import { Descriptions } from 'palo-ui-system';

const ficha = [
  { termino: 'Código', valor: 'TK-1039', mono: true, copiable: true },
  { termino: 'Estado', clave: 'estado' },
  { termino: 'Solicitante', valor: 'Mariana Sosa' },
  { termino: 'CUIT', valor: '27-28901234-6', mono: true, copiable: true },
  { termino: 'Área', valor: 'Docs' },
  { termino: 'Responsable', valor: '' },
  { termino: 'Canal', valor: 'Mail' },
  { termino: 'Abierta hace', valor: '52 h' },
  { termino: 'Detalle', valor: 'Falta la firma del garante en la página 3 del contrato de locación. Se pidió el 21/10 y se reiteró el 24/10.', ancho: 2 },
];
</script>

<template>
  <Descriptions :items="ficha" :columnas="2" class="ficha">
    <template #estado><span class="tag error">Vencida</span></template>
  </Descriptions>
</template>

<style scoped>
.ficha { width: 100%; }
</style>
