<script setup>
import { ref } from 'vue';

const nombre = ref('Ana Ruiz');
const area = ref('Soporte');
</script>

<template>
  <div class="campo">
    <label for="nombre">Nombre</label>
    <input id="nombre" v-model="nombre">
  </div>
  <div class="campo">
    <label for="area">Área</label>
    <select id="area" v-model="area">
      <option v-for="a in ['Soporte', 'Legales', 'Finanzas', 'Personas', 'Operaciones']" :key="a">{{ a }}</option>
    </select>
  </div>
</template>

<style scoped>
.campo { width: 100%; max-width: 320px; }
</style>
