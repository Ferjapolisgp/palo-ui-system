<script setup>
import { computed, ref, watch } from 'vue';
import { BarraHerramientas, DataTable, Descriptions, Desplegable, Drawer, Paginacion, notificar } from 'palo-ui-system';
import { bandeja, estadosSolicitud } from '../../datos/ejemplo.js';

const COLUMNAS = [
  { clave: 'codigo', titulo: 'Código', mono: true, ordenable: true, ancho: 96 },
  { clave: 'asunto', titulo: 'Asunto', ordenable: true },
  { clave: 'solicitante', titulo: 'Solicitante', ordenable: true },
  { clave: 'area', titulo: 'Área' },
  { clave: 'horas', titulo: 'Abierta', alinear: 'derecha', mono: true, ordenable: true, formato: (h) => `${h} h` },
  { clave: 'estado', titulo: 'Estado' },
];
const POR_PAGINA = 8;
const busqueda = ref('');
const estado = ref('');
const orden = ref({ clave: 'horas', dir: 'desc' });
const seleccion = ref([]);
const pagina = ref(1);
const cargando = ref(false);

// Lo que en una app real hace el servidor: filtrar, ordenar y cortar la página.
const comparar = new Intl.Collator('es', { numeric: true }).compare;
const filtradas = computed(() => {
  const q = busqueda.value.trim().toLowerCase();
  const lista = bandeja.filter((s) => (!estado.value || s.tono === estado.value) && `${s.codigo} ${s.asunto} ${s.solicitante}`.toLowerCase().includes(q));
  const o = orden.value;
  if (!o) return lista;
  return [...lista].sort((a, b) => (o.dir === 'desc' ? -1 : 1) * (typeof a[o.clave] === 'number' ? a[o.clave] - b[o.clave] : comparar(a[o.clave], b[o.clave])));
});
const filas = computed(() => filtradas.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA));
watch([busqueda, estado], () => (pagina.value = 1));
// Simula la espera del servidor al cambiar de orden o de página: las filas se atenúan hasta que llegan las nuevas.
watch([orden, pagina], () => {
  cargando.value = true;
  setTimeout(() => (cargando.value = false), 450);
});

function asignarme() {
  notificar({ titulo: `${seleccion.value.length} ${seleccion.value.length === 1 ? 'solicitud asignada' : 'solicitudes asignadas'} a vos`, detalle: 'Datos de ejemplo: no se asignó nada.' });
  seleccion.value = [];
}

const actual = ref(null);
const abierto = ref(false);
function abrir(fila) {
  actual.value = fila;
  abierto.value = true;
}
const ficha = computed(() => actual.value && [
  { termino: 'Código', valor: actual.value.codigo, mono: true, copiable: true },
  { termino: 'Estado', clave: 'estado', valor: actual.value.estado },
  { termino: 'Solicitante', valor: actual.value.solicitante },
  { termino: 'Área', valor: actual.value.area },
  { termino: 'Responsable', valor: actual.value.responsable },
  { termino: 'Abierta hace', valor: `${actual.value.horas} h` },
]);
</script>

<template>
  <div class="bandeja">
    <BarraHerramientas v-model:busqueda="busqueda" placeholder="Buscar por código, asunto o persona" :seleccionadas="seleccion.length" @quitar-seleccion="seleccion = []">
      <template #filtros><Desplegable v-model="estado" etiqueta="Estado" :opciones="estadosSolicitud" /></template>
      <template #seleccion><button type="button" @click="asignarme">Asignarme</button></template>
    </BarraHerramientas>
    <DataTable v-model:seleccion="seleccion" v-model:orden="orden" :columnas="COLUMNAS" :filas="filas" titulo="Bandeja de solicitudes" clave-fila="codigo"
               seleccionable fila-clicable :cargando="cargando" :etiqueta-fila="(f) => `${f.codigo}, ${f.asunto}`" @fila="abrir">
      <template #celda-estado="{ fila }"><span class="tag" :class="fila.tono">{{ fila.estado }}</span></template>
    </DataTable>
    <Paginacion v-model:pagina="pagina" :total="filtradas.length" :por-pagina="POR_PAGINA" unidad="solicitudes" />

    <Drawer v-model:abierto="abierto" :titulo="actual?.asunto ?? ''">
      <Descriptions v-if="ficha" :items="ficha">
        <template #estado><span class="tag" :class="actual.tono">{{ actual.estado }}</span></template>
      </Descriptions>
      <template #acciones="{ cerrar }"><button type="button" @click="cerrar">Volver a la lista</button><button type="button" class="primario">Responder</button></template>
    </Drawer>
  </div>
</template>

<style scoped>
.bandeja { display: grid; gap: 12px; width: 100%; min-width: 0; }
</style>
