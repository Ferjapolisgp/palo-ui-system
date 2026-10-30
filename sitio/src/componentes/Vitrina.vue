<script setup>
import { computed, ref } from 'vue';
import { Advertencia, Avatar, BarraHerramientas, BarraLateral, CabeceraPagina, DataTable, Descriptions, Desplegable, Drawer, Indicador, Paginacion, notificar } from 'palo-ui-system';
import { canalesHoy, estadosSolicitud, fechaLarga, navegacionApp, resueltas14, solicitudes, ultimos14 } from '../datos/ejemplo.js';

// Una pantalla real armada solo con piezas de la librería: la bandeja de la Ticketera.
const colapsada = ref(false);
const activo = ref('bandeja');
const vista = ref('bandeja');
const busqueda = ref('');
const estado = ref('');
const seleccion = ref([]);
const pagina = ref(1);
const orden = ref(null);
const COLUMNAS = [
  { clave: 'codigo', titulo: 'Código', mono: true, ordenable: true, ancho: 96 },
  { clave: 'asunto', titulo: 'Asunto', ordenable: true },
  { clave: 'solicitante', titulo: 'Solicitante', ordenable: true },
  { clave: 'area', titulo: 'Área' },
  { clave: 'horas', titulo: 'Abierta', alinear: 'derecha', mono: true, ordenable: true, formato: (h) => `${h} h` },
  { clave: 'estado', titulo: 'Estado' },
];
const actual = ref(null);
const detalle = ref(false);
function abrir(s) {
  actual.value = s;
  detalle.value = true;
}
const ficha = computed(() => actual.value && [
  { termino: 'Código', valor: actual.value.codigo, mono: true, copiable: true },
  { termino: 'Estado', clave: 'estado' },
  { termino: 'Solicitante', valor: actual.value.solicitante },
  { termino: 'Área', valor: actual.value.area },
  { termino: 'Abierta hace', valor: `${actual.value.horas} h` },
]);
const dias = ultimos14.map((d) => fechaLarga(d.fecha));
const PLAZO = 48; // ejemplo: horas para responder cualquier solicitud
const visibles = computed(() => solicitudes.filter((s) => (!estado.value || s.tono === estado.value) && (s.codigo + s.asunto + s.solicitante).toLowerCase().includes(busqueda.value.toLowerCase())));
function asignar() {
  notificar({ titulo: `${seleccion.value.length} ${seleccion.value.length === 1 ? 'solicitud asignada' : 'solicitudes asignadas'} a Ana Ruiz`, detalle: 'Datos de ejemplo: no se asignó nada.' });
  seleccion.value = [];
}
</script>

<template>
  <div class="vitrina" :class="{ colapsada }">
    <BarraLateral v-model:colapsada="colapsada" producto="Tickets" serie="Soporte" :grupos="navegacionApp" :activo="activo" class="lat" @navegar="(it) => (activo = it.valor)">
      <template #pie="{ colapsada: c }">
        <div class="persona"><Avatar nombre="Ana Ruiz" :tam="c ? 44 : 28" /><div v-if="!c"><b>Ana Ruiz</b><small>Soporte · turno mañana</small></div></div>
      </template>
    </BarraLateral>
    <div class="principal">
      <CabeceraPagina v-model="vista" titulo="Solicitudes" serie="TK-01" :tabs="[{ valor: 'bandeja', texto: 'Bandeja' }, { valor: 'mias', texto: 'Asignadas a mí' }, { valor: 'auditoria', texto: 'Auditoría', deshabilitada: true }]" />
      <BarraHerramientas v-model:busqueda="busqueda" placeholder="Buscar por código, asunto o persona" :seleccionadas="seleccion.length" @quitar-seleccion="seleccion = []">
        <template #filtros>
          <Desplegable v-model="estado" etiqueta="Estado" :opciones="estadosSolicitud" />
        </template>
        <template #acciones><button type="button">Exportar</button><button type="button" class="primario">Nueva solicitud</button></template>
        <template #seleccion><button type="button" @click="asignar">Asignarme</button></template>
      </BarraHerramientas>
      <div class="cuerpo-app">
        <div class="kpis">
          <!-- Una forma de indicador por pregunta: tendencia, volumen por día, composición y tope. -->
          <Indicador etiqueta="Ingresadas hoy" :valor="ultimos14.at(-1).cantidad" variacion="▲ 8 % contra ayer" :tendencia="ultimos14.map((d) => d.cantidad)" :etiquetas-tendencia="dias" />
          <Indicador etiqueta="Resueltas por día" :valor="resueltas14.at(-1)" variacion="▼ 7 contra ayer" forma="barras" :tendencia="resueltas14" :etiquetas-tendencia="dias" />
          <Indicador etiqueta="Canal de ingreso" valor="45 % web" variacion="▲ 2 puntos contra ayer" tono="ok" forma="composicion" grafico="solido" :partes="canalesHoy" />
          <Indicador etiqueta="Carga del equipo" valor="94 asignadas" variacion="▲ 12 desde la mañana" tono="aviso" forma="tope" :usado="94" :limite="128" />
        </div>
        <DataTable v-model:seleccion="seleccion" v-model:orden="orden" :columnas="COLUMNAS" :filas="visibles" titulo="Bandeja de solicitudes" clave-fila="codigo"
                   seleccionable orden-local fila-clicable @fila="abrir">
          <template #celda-estado="{ fila }">
            <Advertencia v-if="fila.tono === 'error'">Vencida hace {{ fila.horas - PLAZO }} h</Advertencia>
            <Advertencia v-else-if="fila.tono === 'aviso'" tono="aviso">Vence en {{ PLAZO - fila.horas }} h</Advertencia>
            <span v-else class="tag" :class="fila.tono">{{ fila.estado }}</span>
          </template>
        </DataTable>
        <Paginacion v-model:pagina="pagina" :total="1284" :por-pagina="5" unidad="solicitudes" />
      </div>
    </div>
    <Drawer v-model:abierto="detalle" :titulo="actual?.asunto ?? ''">
      <Descriptions v-if="ficha" :items="ficha">
        <template #estado><span class="tag" :class="actual.tono">{{ actual.estado }}</span></template>
      </Descriptions>
      <template #acciones="{ cerrar }"><button type="button" @click="cerrar">Volver a la bandeja</button><button type="button" class="primario">Responder</button></template>
    </Drawer>
  </div>
</template>

<style scoped>
.vitrina { display: grid; grid-template-columns: auto minmax(0, 1fr); overflow: hidden; background: var(--bg); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.principal { min-width: 0; }
.cuerpo-app { display: grid; gap: 14px; padding: 16px 20px 18px; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; }
.kpis > * { min-height: 136px; }
.persona { display: flex; align-items: center; gap: 10px; min-width: 0; }
.persona b { display: block; font-size: .82rem; }
.persona small { display: block; color: var(--sub); font-size: .72rem; white-space: nowrap; }
@media (max-width: 760px) {
  .vitrina { grid-template-columns: minmax(0, 1fr); }
  .lat { display: none; }
}
</style>
