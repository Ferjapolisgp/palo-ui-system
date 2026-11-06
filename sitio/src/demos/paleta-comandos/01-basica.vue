<script setup>
import { ref } from 'vue';
import { PaletaComandos } from 'palo-ui-system';

const abierta = ref(false);
const ultimo = ref('');
// Datos de ejemplo
const comandos = [
  { valor: 'nueva', texto: 'Nueva solicitud', grupo: 'Acciones', icono: 'mas', atajo: '⌘ N' },
  { valor: 'asignar', texto: 'Reasignar seleccionadas', grupo: 'Acciones', icono: 'usuarios' },
  { valor: 'exportar', texto: 'Exportar a CSV', grupo: 'Acciones', icono: 'descargar', palabras: 'descargar planilla' },
  { valor: 'bandeja', texto: 'Ir a la bandeja', grupo: 'Pantallas', icono: 'bandeja' },
  { valor: 'informes', texto: 'Ir a informes', grupo: 'Pantallas', icono: 'informes' },
  { valor: 'ajustes', texto: 'Abrir preferencias', grupo: 'Pantallas', icono: 'ajustes', palabras: 'configuración' },
];
</script>

<template>
  <div class="todo">
    <button type="button" @click="abierta = true">Abrir la paleta <kbd class="atajo">⌘ K</kbd></button>
    <p class="sub">Última acción: <b>{{ ultimo || '—' }}</b></p>
    <PaletaComandos v-model:abierta="abierta" :comandos="comandos" @ejecutar="(c) => (ultimo = c.texto)" />
  </div>
</template>

<style scoped>
.todo { display: grid; justify-items: start; gap: 12px; }
.sub { margin: 0; color: var(--sub); }
</style>
