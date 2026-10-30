<script setup>
import { ref } from 'vue';
import { Interruptor } from 'palo-ui-system';

const incluirArchivadas = ref(true);
const avisos = ref(true);
</script>

<template>
  <div class="opciones">
    <label class="casilla"><input v-model="incluirArchivadas" type="checkbox"> Incluir solicitudes archivadas</label>
    <Interruptor v-model="avisos">Avisarme por mail cuando me asignen algo</Interruptor>
    <Interruptor :model-value="false" disabled>Firma digital (la habilita un administrador)</Interruptor>
  </div>
</template>

<style scoped>
.opciones { display: grid; gap: 14px; }
.casilla { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--txt); font-size: .9rem; font-weight: 400; }
</style>
