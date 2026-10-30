<script setup>
import { ref } from 'vue';
import { Spin, notificar } from 'palo-ui-system';

const guardando = ref(false);
function guardar() {
  guardando.value = true;
  setTimeout(() => {
    guardando.value = false;
    notificar({ titulo: 'Cambios guardados', detalle: 'Datos de ejemplo.' });
  }, 1500);
}
</script>

<template>
  <div class="usos">
    <button type="button" class="primario" :disabled="guardando" @click="guardar">
      <Spin v-if="guardando" etiqueta="" />{{ guardando ? 'Guardando…' : 'Guardar cambios' }}
    </button>
    <span class="sub sinc"><Spin :tam="14" etiqueta="Sincronizando con Docs" />Sincronizando con Docs</span>
  </div>
</template>

<style scoped>
.usos { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; }
.primario { display: inline-flex; align-items: center; gap: 8px; }
.sinc { display: inline-flex; align-items: center; gap: 8px; font-size: .86rem; }
</style>
