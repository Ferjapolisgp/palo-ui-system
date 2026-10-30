<script setup>
import { ref } from 'vue';
import { Modal, notificar } from 'palo-ui-system';

const abierto = ref(false);
const nombre = ref('Mariana Sosa');
const email = ref('mariana.sosa@ejemplo.com');
function guardar() {
  abierto.value = false;
  notificar({ titulo: 'Contacto actualizado', detalle: 'Datos de ejemplo: no se guardó nada.' });
}
</script>

<template>
  <button type="button" @click="abierto = true">Editar contacto</button>
  <Modal v-model:abierto="abierto" titulo="Editar contacto de TK-1039" ancho="chico">
    <template #cabecera><span class="sub">Solicitante del ticket</span></template>
    <form id="form-contacto" class="campos" @submit.prevent="guardar">
      <label>Nombre<input v-model="nombre" autofocus></label>
      <label>Email<input v-model="email" type="email"></label>
    </form>
    <template #acciones="{ cerrar }">
      <button type="button" @click="cerrar">Cancelar</button>
      <button type="submit" form="form-contacto" class="primario">Guardar</button>
    </template>
  </Modal>
</template>

<style scoped>
.campos { display: grid; gap: 14px; }
.campos label { display: grid; gap: 6px; }
</style>
