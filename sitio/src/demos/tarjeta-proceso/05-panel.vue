<script setup>
import { computed, ref } from 'vue';
import { TarjetaProceso } from 'palo-ui-system';

// Datos de ejemplo: cada toque avanza el lote.
const avance = ref(40);
const lecturas = computed(() => [
  { etiqueta: 'Velocidad', valor: avance.value >= 100 ? '—' : '47 /min' },
  { etiqueta: 'Errores', valor: String(7 + Math.floor((avance.value - 40) / 15)) },
  { etiqueta: 'Restan', valor: avance.value >= 100 ? '00:00' : `0${Math.ceil((100 - avance.value) / 15)}:00` },
]);
</script>

<template>
  <div class="uno">
    <TarjetaProceso variante="panel" codigo="PR-0432" titulo="Procesamiento del lote nocturno" :estado="avance >= 100 ? 'ok' : 'curso'" :avance="avance" :lecturas="lecturas">
      <template #acciones><button type="button" :disabled="avance >= 100" @click="avance = Math.min(100, avance + 15)">Avanzar lote</button></template>
    </TarjetaProceso>
  </div>
</template>

<style scoped>
.uno { width: 100%; max-width: 420px; }
</style>
