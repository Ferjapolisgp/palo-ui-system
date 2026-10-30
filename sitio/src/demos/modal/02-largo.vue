<script setup>
import { ref } from 'vue';
import { Modal } from 'palo-ui-system';

const abierto = ref(false);
const pasos = [
  ['08:05', 'Ingresó por Docs'], ['08:12', 'Asignada a Lucas Gómez'], ['08:40', 'Pedido de firma al garante'], ['10:00', 'Recordatorio automático al garante'],
  ['11:25', 'Respuesta del solicitante'], ['11:31', 'Documento recibido'], ['12:02', 'Documento rechazado: firma ilegible'], ['12:05', 'Nuevo pedido de firma'],
  ['15:00', 'Recordatorio automático al garante'], ['18:00', 'Aviso de vencimiento próximo'], ['09:00', 'Recordatorio automático al garante'], ['12:00', 'Escalada a la responsable del área'],
  ['14:10', 'Comentario interno de Ana Ruiz'], ['16:30', 'Llamado al garante sin respuesta'], ['08:05', 'Vencida sin respuesta'], ['08:06', 'Aviso al solicitante'],
];
</script>

<template>
  <button type="button" @click="abierto = true">Ver historial</button>
  <Modal v-model:abierto="abierto" titulo="Historial de TK-1039" ancho="grande">
    <template #cabecera><span class="tag error">Vencida</span></template>
    <ol class="historial">
      <li v-for="([hora, texto], i) in pasos" :key="i"><span class="hora">{{ hora }}</span>{{ texto }}</li>
    </ol>
    <template #acciones="{ cerrar }"><button type="button" class="primario" @click="cerrar">Listo</button></template>
  </Modal>
</template>

<style scoped>
.historial { display: grid; margin: 0; padding: 0; list-style: none; }
.historial li { display: flex; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--borde); }
.hora { font: 600 .78rem var(--mono); color: var(--sub); }
</style>
