<script setup>
import { ref } from 'vue';
import { BarraLateral, CuentaUsuario } from 'palo-ui-system';
import { navegacionApp } from '../../datos/ejemplo.js';

const colapsada = ref(false);
const activo = ref('bandeja');
const opciones = [
  { texto: 'Mi perfil', icono: 'usuario', valor: 'perfil' },
  { texto: 'Cerrar sesión', icono: 'salir', valor: 'salir', tono: 'error' },
];
</script>

<template>
  <BarraLateral v-model:colapsada="colapsada" producto="Tickets" serie="Soporte" :grupos="navegacionApp" :activo="activo" class="demo-lat" @navegar="(it) => (activo = it.valor)">
    <template #pie="{ colapsada: c }">
      <CuentaUsuario nombre="Ana Ruiz" detalle="Soporte · turno mañana" :colapsada="c" :opciones="opciones" />
    </template>
  </BarraLateral>
</template>

<style scoped>
.demo-lat { min-height: 440px; border: 1px solid var(--borde); border-radius: var(--r-lg); }
</style>
