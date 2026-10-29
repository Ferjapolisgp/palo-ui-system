<script setup>
import { solicitudes } from '../../datos/ejemplo.js';
</script>

<template>
  <div class="tabla-simple">
    <table>
      <thead><tr><th>Código</th><th>Asunto</th><th>Área</th><th class="num">Abierta</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="s in solicitudes" :key="s.codigo">
          <td class="cod">{{ s.codigo }}</td>
          <td>{{ s.asunto }}</td>
          <td class="sub">{{ s.area }}</td>
          <td class="num">{{ s.horas }} h</td>
          <td><span class="tag" :class="s.tono">{{ s.estado }}</span></td>
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
