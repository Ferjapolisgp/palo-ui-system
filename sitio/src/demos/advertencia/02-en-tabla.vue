<script setup>
import { Advertencia } from 'palo-ui-system';
import { solicitudes } from '../../datos/ejemplo.js';

// Ejemplo: plazo de 48 h para toda solicitud. Pasado el plazo, la fila lleva la advertencia.
const PLAZO = 48;
</script>

<template>
  <div class="tabla-simple">
    <table>
      <thead><tr><th>Código</th><th>Asunto</th><th class="num">Abierta</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="s in solicitudes" :key="s.codigo">
          <td class="cod">{{ s.codigo }}</td>
          <td>{{ s.asunto }}</td>
          <td class="num">{{ s.horas }} h</td>
          <td>
            <Advertencia v-if="s.tono === 'error'">Vencida hace {{ s.horas - PLAZO }} h</Advertencia>
            <Advertencia v-else-if="s.tono === 'aviso'" tono="aviso">Vence en {{ PLAZO - s.horas }} h</Advertencia>
            <span v-else class="tag" :class="s.tono">{{ s.estado }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tabla-simple { width: 100%; }
.cod { font: 700 .78rem var(--mono); }
.num { text-align: right !important; font: 500 .8rem var(--mono); }
</style>
