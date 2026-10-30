<script setup>
import { onBeforeUnmount } from 'vue';
import { Notificaciones, cerrarTodas, notificar } from 'palo-ui-system';

// Un ejemplo por tono. Error no se cierra solo: queda hasta que alguien lo lee.
const TONOS = [
  { tono: 'ok', boton: 'Ok', titulo: 'Cambios guardados', detalle: 'ALTA-2087 · Sosa Diseño SRL' },
  { tono: 'info', boton: 'Info', titulo: 'Hay una versión nueva del contrato', detalle: 'La subió Legales hace 5 min' },
  { tono: 'aviso', boton: 'Aviso', titulo: 'Quedan 2 firmas del mes', detalle: 'El plan incluye 500 envíos' },
  { tono: 'error', boton: 'Error', titulo: 'No se pudo enviar a firmar', detalle: 'El servidor de firma no responde', accion: { texto: 'Reintentar', hacer: () => notificar({ titulo: 'Enviado a firmar', detalle: 'Datos de ejemplo' }) } },
];

// Vista previa fija en la página (canal propio); los botones las disparan de verdad, abajo a la derecha.
[...TONOS].reverse().forEach((t) => notificar({ ...t, duracion: 0, canal: 'demo-tonos' }));
onBeforeUnmount(() => cerrarTodas('demo-tonos'));
</script>

<template>
  <div class="demo-tonos">
    <Notificaciones canal="demo-tonos" :fija="false" />
    <div class="botones">
      <button v-for="t in TONOS" :key="t.tono" type="button" @click="notificar(t)">{{ t.boton }}</button>
    </div>
  </div>
</template>

<style scoped>
.demo-tonos { display: grid; gap: 14px; justify-items: start; }
.botones { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
