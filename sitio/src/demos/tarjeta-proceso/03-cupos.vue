<script setup>
import { computed, ref } from 'vue';
import { TarjetaProceso } from 'palo-ui-system';

// Datos de ejemplo: 48 cupos; los últimos 14 todavía no se resolvieron.
const celdas = ref(Array.from({ length: 48 }, (_, i) => (i < 34 ? (i % 9 === 7 ? 'error' : 'ok') : 'pend')));
const rechazados = computed(() => celdas.value.filter((c) => c === 'error').length);
const resaltar = ref(null);
</script>

<template>
  <div class="uno">
    <TarjetaProceso codigo="PR-0430" titulo="Asignación de cupos de capacitación" detalle="Asignando · 34 de 48 resueltos (ejemplo)" estado="curso"
                    :celdas="celdas" :resaltar="resaltar" leyenda :nombres-celdas="{ ok: 'Confirmados', error: 'Rechazados', pend: 'Pendientes' }">
      <template #pie>Hace <b>02:00</b></template>
      <template #acciones>
        <button type="button" :disabled="!rechazados" @click="resaltar = resaltar ? null : 'error'">{{ resaltar ? 'Ver todos' : 'Ver rechazados' }}</button>
      </template>
    </TarjetaProceso>
  </div>
</template>

<style scoped>
.uno { width: 100%; max-width: 360px; }
</style>
