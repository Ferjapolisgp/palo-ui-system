<script setup>
import { ref } from 'vue';
import { Historial, Interruptor } from 'palo-ui-system';

const agrupar = ref(true);
const cargando = ref(false);
const pedido = ref(0);
// Datos de ejemplo
const eventos = [
  { id: 1, titulo: 'Enviado a firmar', texto: 'Contrato de servicio, versión 3.', fecha: '2026-11-04T16:20', autor: 'Ana Ruiz', codigo: 'DOC-218', tono: 'info' },
  { id: 2, titulo: 'Importes validados', fecha: '2026-11-04T11:05', autor: 'Lucas Gómez', tono: 'ok' },
  { id: 3, titulo: 'Vencimiento en 4 h', texto: 'Pide acción antes de las 18:00.', fecha: '2026-11-03T09:40', codigo: 'TK-1042', tono: 'aviso' },
  { id: 4, titulo: 'Cobro rechazado', texto: 'Fondos insuficientes. Pedí otro medio de pago.', fecha: '2026-11-03T08:12', tono: 'error' },
  { id: 5, titulo: 'Solicitud creada', fecha: '2026-11-02T17:30', autor: 'Carla Méndez' },
];
</script>

<template>
  <div class="todo">
    <div class="ctl"><Interruptor v-model="agrupar">Agrupar por día</Interruptor><Interruptor v-model="cargando">Cargando</Interruptor></div>
    <Historial :eventos="eventos" :agrupar="agrupar" :cargando="cargando" hay-mas @mas="pedido = pedido + 1" />
    <p class="sub">Pediste «Ver más» {{ pedido }} {{ pedido === 1 ? 'vez' : 'veces' }}: la app trae los eventos y los suma.</p>
    <Historial :eventos="[]" etiqueta="Historial vacío" />
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 20px; width: 100%; max-width: 560px; }
.sub { margin: 0; color: var(--sub); font-size: .8rem; }
.ctl { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
