<script setup>
import { ref } from 'vue';
import { Avatar, BarraLateral } from 'palo-ui-system';
import { navegacionApp } from '../../datos/ejemplo.js';

const colapsada = ref(false);
const activo = ref('bandeja');
</script>

<template>
  <BarraLateral v-model:colapsada="colapsada" producto="Tickets" serie="Soporte" :grupos="navegacionApp" :activo="activo" class="demo-lat" @navegar="(it) => (activo = it.valor)">
    <template #pie="{ colapsada: c }">
      <div class="persona">
        <Avatar nombre="Ana Ruiz" :tam="28" />
        <div v-if="!c"><b>Ana Ruiz</b><small>Soporte · turno mañana</small></div>
      </div>
    </template>
  </BarraLateral>
</template>

<style scoped>
.demo-lat { min-height: 440px; border: 1px solid var(--borde); border-radius: var(--r-lg); }
.persona { display: flex; align-items: center; gap: 10px; min-width: 0; }
.persona b { display: block; font-size: .82rem; }
.persona small { display: block; color: var(--sub); font-size: .72rem; white-space: nowrap; }
</style>
