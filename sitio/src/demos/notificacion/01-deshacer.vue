<script setup>
import { notificar } from 'palo-ui-system';

function enviar() {
  notificar({
    titulo: 'Enviado a firmar',
    detalle: 'Contrato de locación 2026.pdf · 2 firmantes',
    deshacer: () => notificar({ titulo: 'Envío cancelado', detalle: 'No le llegó a nadie.' }),
  });
}
</script>

<template>
  <button type="button" class="primario" @click="enviar">Enviar a firmar</button>
</template>
