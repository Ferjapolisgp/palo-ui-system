<script setup>
import { ref } from 'vue';
import { PiePagina } from 'palo-ui-system';

const ultimo = ref('');
// Datos de ejemplo
const inicio = [
  { tipo: 'kpi', etiqueta: 'Abiertas', valor: '128' },
  { tipo: 'kpi', etiqueta: 'Por vencer', valor: '7', tono: 'aviso' },
  { tipo: 'kpi', etiqueta: 'Vencidas', valor: '2', tono: 'error' },
  { tipo: 'kpi', etiqueta: 'SLA', valor: '96,4', unidad: '%', tono: 'ok' },
];
const fin = [
  { tipo: 'dato', etiqueta: 'Versión', valor: 'v1.1.0', copiable: true },
  { tipo: 'dato', etiqueta: 'Entorno', valor: 'Producción' },
  { tipo: 'enlace', texto: 'Ayuda', href: 'https://ejemplo.com/ayuda', externo: true },
  { tipo: 'enlace', texto: 'Reportar un problema' },
];
</script>

<template>
  <div class="todo">
    <PiePagina :inicio="inicio" :fin="fin" @abrir="(it) => (ultimo = `Abrir: ${it.texto}`)" @copiar="(it) => (ultimo = `Copiado: ${it.valor}`)" />
    <PiePagina :inicio="[{ tipo: 'dato', etiqueta: 'Serie', valor: 'SERIE 01' }]" :fin="[{ tipo: 'enlace', texto: 'Términos', href: 'https://ejemplo.com/terminos', externo: true }, { tipo: 'enlace', texto: 'Privacidad', href: 'https://ejemplo.com/privacidad', externo: true }]" />
    <p class="sub">Última acción: <b>{{ ultimo || '—' }}</b></p>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 12px; width: 100%; }
.todo > footer { border: 1px solid var(--borde); }
.sub { margin: 0; color: var(--sub); }
</style>
