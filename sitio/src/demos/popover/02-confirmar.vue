<script setup>
import { Popover, notificar } from 'palo-ui-system';

function archivar(cerrar) {
  cerrar();
  notificar({ titulo: 'TK-1028 archivada', detalle: 'Datos de ejemplo.', deshacer: () => notificar({ titulo: 'TK-1028 vuelve a la bandeja' }) });
}
</script>

<template>
  <Popover titulo="¿Archivar TK-1028?">
    <button type="button">Archivar</button>
    <template #contenido="{ cerrar }">
      <p class="sub texto">Sale de la bandeja. Se puede recuperar desde «Archivadas».</p>
      <div class="acciones">
        <button type="button" @click="cerrar">Cancelar</button>
        <button type="button" class="primario" @click="archivar(cerrar)">Archivar</button>
      </div>
    </template>
  </Popover>
</template>

<style scoped>
.texto { margin: 0; font-size: .86rem; }
.acciones { display: flex; justify-content: flex-end; gap: 8px; }
</style>
