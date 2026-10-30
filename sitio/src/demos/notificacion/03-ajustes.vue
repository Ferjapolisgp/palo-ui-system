<script setup>
import { notificar } from 'palo-ui-system';

function compacta() {
  notificar({ titulo: 'Copiado al portapapeles', variante: 'compacta', duracion: 2500 });
}
function conAccion() {
  notificar({ tono: 'info', titulo: '3 solicitudes nuevas en la bandeja', detalle: 'Asignadas a Soporte', accion: { texto: 'Ver', hacer: () => {} } });
}
function fija() {
  notificar({ tono: 'aviso', titulo: 'La sesión vence en 5 min', detalle: 'Guardá lo que estés editando', duracion: 0, icono: 'reloj' });
}
function varias() {
  ['TK-1042', 'TK-1039', 'TK-1037', 'TK-1031', 'TK-1028', 'TK-1025'].forEach((c) => notificar({ titulo: 'Solicitud asignada', detalle: `${c} · Ana Ruiz` }));
}
</script>

<template>
  <button type="button" @click="compacta">Compacta</button>
  <button type="button" @click="conAccion">Con acción</button>
  <button type="button" @click="fija">Fija, con ícono propio</button>
  <button type="button" @click="varias">Seis seguidas</button>
</template>
