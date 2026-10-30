<script setup>
import { ref } from 'vue';
import { Paginacion } from 'palo-ui-system';

const pagina = ref(1);
</script>

<template>
  <Paginacion v-model:pagina="pagina" :total="1284" :por-pagina="25" unidad="solicitudes" style="width: 100%" />
</template>
