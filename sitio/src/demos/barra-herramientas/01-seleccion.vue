<script setup>
import { computed, ref } from 'vue';
import { BarraHerramientas, Desplegable, Icono } from 'palo-ui-system';
import { estadosSolicitud, solicitudes } from '../../datos/ejemplo.js';

const busqueda = ref('');
const estado = ref('');
const seleccion = ref([]);

const visibles = computed(() => solicitudes.filter((s) => (!estado.value || s.tono === estado.value)
  && (s.codigo + s.asunto + s.solicitante).toLowerCase().includes(busqueda.value.toLowerCase())));
const todas = computed({
  get: () => visibles.value.length > 0 && visibles.value.every((s) => seleccion.value.includes(s.codigo)),
  set: (v) => { seleccion.value = v ? visibles.value.map((s) => s.codigo) : []; },
});
</script>

<template>
  <div class="listado">
    <BarraHerramientas v-model:busqueda="busqueda" placeholder="Buscar por código, asunto o persona" :seleccionadas="seleccion.length" @quitar-seleccion="seleccion = []">
      <template #filtros><Desplegable v-model="estado" etiqueta="Estado" :opciones="estadosSolicitud" /></template>
      <template #acciones>
        <button type="button" class="icono" aria-label="Vista compacta" title="Vista compacta"><Icono nombre="densidad" /></button>
        <button type="button">Exportar</button>
        <button type="button" class="primario">Nueva solicitud</button>
      </template>
      <template #seleccion>
        <button type="button">Asignar</button>
        <button type="button">Marcar resueltas</button>
      </template>
    </BarraHerramientas>
    <div class="tabla-simple">
      <table>
        <thead><tr><th class="chk"><input v-model="todas" type="checkbox" aria-label="Seleccionar todas"></th><th>Código</th><th>Asunto</th><th>Estado</th></tr></thead>
        <tbody>
          <tr v-for="s in visibles" :key="s.codigo" :class="{ sel: seleccion.includes(s.codigo) }">
            <td class="chk"><input v-model="seleccion" type="checkbox" :value="s.codigo" :aria-label="`Seleccionar ${s.codigo}`"></td>
            <td class="cod">{{ s.codigo }}</td><td>{{ s.asunto }}</td><td><span class="tag" :class="s.tono">{{ s.estado }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.listado { width: 100%; border: 1px solid var(--borde); border-radius: var(--r-lg); background: var(--bg); }
.listado .tabla-simple { border: 0; border-radius: 0 0 var(--r-lg) var(--r-lg); }
.chk { width: 40px; }
.cod { font: 700 .78rem var(--mono); }
tr.sel td { background: color-mix(in srgb, var(--senal) 9%, transparent); }
</style>
