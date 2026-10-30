<script setup>
import { computed, ref } from 'vue';
import { Popover } from 'palo-ui-system';
import { solicitudes } from '../../datos/ejemplo.js';

const COLUMNAS = [['codigo', 'Código'], ['asunto', 'Asunto'], ['solicitante', 'Solicitante'], ['area', 'Área'], ['estado', 'Estado']];
const visibles = ref(['codigo', 'asunto', 'estado']);
const columnas = computed(() => COLUMNAS.filter(([clave]) => visibles.value.includes(clave)));
</script>

<template>
  <div class="todo">
    <Popover titulo="Columnas visibles" alinear="fin">
      <button type="button">Columnas · {{ visibles.length }}</button>
      <template #contenido>
        <label v-for="[clave, texto] in COLUMNAS" :key="clave" class="opcion">
          <input v-model="visibles" type="checkbox" :value="clave" :disabled="visibles.length === 1 && visibles.includes(clave)">{{ texto }}
        </label>
      </template>
    </Popover>
    <div class="tabla-simple">
      <table>
        <thead><tr><th v-for="[clave, texto] in columnas" :key="clave">{{ texto }}</th></tr></thead>
        <tbody><tr v-for="s in solicitudes.slice(0, 3)" :key="s.codigo"><td v-for="[clave] in columnas" :key="clave">{{ s[clave] }}</td></tr></tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 12px; justify-items: end; width: 100%; }
.tabla-simple { width: 100%; }
.opcion { display: flex; align-items: center; gap: 10px; font-size: .88rem; color: var(--txt); }
</style>
