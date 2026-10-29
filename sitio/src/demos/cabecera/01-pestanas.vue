<script setup>
import { ref } from 'vue';
import { CabeceraPagina } from 'palo-ui-system';

const vista = ref('bandeja');
const tabs = [
  { valor: 'bandeja', texto: 'Bandeja' },
  { valor: 'mias', texto: 'Asignadas a mí' },
  { valor: 'auditoria', texto: 'Auditoría', deshabilitada: true, ayuda: 'Llega en la próxima versión' },
];
</script>

<template>
  <CabeceraPagina v-model="vista" titulo="Solicitudes" serie="TK-01" :tabs="tabs" style="width: 100%">
    <button type="button" class="primario">Nueva solicitud</button>
  </CabeceraPagina>
</template>
