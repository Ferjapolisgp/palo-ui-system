<script setup>
import { ref } from 'vue';
import { Advertencia, Interruptor } from 'palo-ui-system';

const animada = ref(true);
</script>

<template>
  <div class="demo-cinta">
    <Interruptor v-model="animada">Franjas en movimiento</Interruptor>
    <div class="fila">
      <Advertencia :animada="animada">Vencido hace 18 h</Advertencia>
      <Advertencia tono="aviso" :animada="animada">Vence en 3 h</Advertencia>
    </div>
  </div>
</template>

<style scoped>
.demo-cinta { display: grid; gap: 14px; }
.fila { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
</style>
