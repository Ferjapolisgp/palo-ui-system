<script setup>
import { computed, ref, useId } from 'vue';
import Skeleton from './Skeleton.vue';
import Vacio from './Vacio.vue';

// Tabla de datos: orden por columna, selección (con Shift para un rango), cabecera y primera columna fijas,
// filas cargando y estado vacío. No pagina ni filtra: eso lo hace quien la usa (normalmente el servidor);
// la tabla muestra las filas que recibe y avisa con eventos. Con orden-local ordena ella misma.
// columnas: [{ clave, titulo, ancho?, alinear?: 'izquierda' | 'derecha' | 'centro', ordenable?, mono?, fija?, formato?(valor, fila) }]
const props = defineProps({
  columnas: { type: Array, required: true },
  filas: { type: Array, default: () => [] },
  claveFila: { type: String, default: 'id' },
  titulo: { type: String, required: true }, // nombre de la tabla para lectores de pantalla
  seleccionable: Boolean,
  seleccion: { type: Array, default: () => [] },
  orden: { type: Object, default: null }, // { clave, dir: 'asc' | 'desc' }
  ordenLocal: Boolean,
  cargando: Boolean,
  filasCarga: { type: Number, default: 5 },
  alto: [Number, String], // con alto, la cabecera queda fija al desplazar
  compacta: Boolean,
  filaClicable: Boolean,
  etiquetaFila: { type: Function, default: null }, // (fila) => texto para «Seleccionar …»
  vacio: { type: Object, default: () => ({ titulo: 'No hay resultados', texto: 'Probá con otra búsqueda o quitá algún filtro.' }) },
});
const emit = defineEmits(['update:seleccion', 'update:orden', 'fila']);
const id = useId();

const clave = (f) => f[props.claveFila];
const valor = (c, f) => (c.formato ? c.formato(f[c.clave], f) : f[c.clave]);

// Orden: cada clic pasa por ascendente → descendente → sin orden.
function ordenar(c) {
  const o = props.orden;
  const sig = o?.clave !== c.clave ? { clave: c.clave, dir: 'asc' } : o.dir === 'asc' ? { clave: c.clave, dir: 'desc' } : null;
  emit('update:orden', sig);
}
const ariaSort = (c) => (props.orden?.clave === c.clave ? (props.orden.dir === 'asc' ? 'ascending' : 'descending') : c.ordenable ? 'none' : undefined);
const comparar = new Intl.Collator('es', { numeric: true, sensitivity: 'base' }).compare;
const visibles = computed(() => {
  const o = props.orden;
  if (!props.ordenLocal || !o) return props.filas;
  const signo = o.dir === 'desc' ? -1 : 1;
  return [...props.filas].sort((a, b) => {
    const x = a[o.clave], y = b[o.clave];
    if (x == null || x === '') return 1; // los vacíos siempre al final
    if (y == null || y === '') return -1;
    return signo * (typeof x === 'number' && typeof y === 'number' ? x - y : comparar(String(x), String(y)));
  });
});

// Selección: el encabezado marca o desmarca las filas visibles; Shift+clic marca el rango desde la última tocada.
const elegidas = computed(() => new Set(props.seleccion));
const marcadas = computed(() => visibles.value.filter((f) => elegidas.value.has(clave(f))).length);
const todas = computed(() => visibles.value.length > 0 && marcadas.value === visibles.value.length);
const algunas = computed(() => marcadas.value > 0 && !todas.value);
let ultima = null;
function alternarTodas() {
  const claves = visibles.value.map(clave);
  emit('update:seleccion', todas.value ? props.seleccion.filter((k) => !claves.includes(k)) : [...new Set([...props.seleccion, ...claves])]);
}
function alternar(f, i, e) {
  const k = clave(f);
  const marcar = !elegidas.value.has(k);
  let claves = [k];
  if (e.shiftKey && ultima !== null) {
    const [a, b] = [Math.min(ultima, i), Math.max(ultima, i)];
    claves = visibles.value.slice(a, b + 1).map(clave);
  }
  ultima = i;
  const set = new Set(props.seleccion);
  claves.forEach((c) => (marcar ? set.add(c) : set.delete(c)));
  emit('update:seleccion', [...set]);
}
const nombreFila = (f) => (props.etiquetaFila ? props.etiquetaFila(f) : String(clave(f)));

function clicFila(f, e) {
  if (!props.filaClicable || e.target.closest('button, a, input, label, select, textarea')) return;
  emit('fila', f);
}

// Columna fija: la primera marcada con fija (si hay casillas, queda pegada a ellas).
const fija = computed(() => props.columnas.find((c) => c.fija)?.clave);
const medida = (v) => (typeof v === 'number' ? `${v}px` : v);
const totalColumnas = computed(() => props.columnas.length + (props.seleccionable ? 1 : 0));
const mostrarCarga = computed(() => props.cargando && !props.filas.length);
</script>

<template>
  <div class="tabla-simple dt" :class="{ compacta, desplazable: alto, sel: seleccionable }" :style="{ maxHeight: medida(alto) }"
       role="region" :aria-labelledby="`${id}-c`" tabindex="0">
    <table :aria-busy="cargando || undefined">
      <caption :id="`${id}-c`" class="oculto">{{ titulo }}</caption>
      <colgroup>
        <col v-if="seleccionable" style="width: 44px">
        <col v-for="c in columnas" :key="c.clave" :style="c.ancho ? { width: medida(c.ancho) } : null">
      </colgroup>
      <thead>
        <tr>
          <th v-if="seleccionable" class="dt-sel" scope="col">
            <input type="checkbox" :checked="todas" :indeterminate="algunas" :disabled="!visibles.length"
                   aria-label="Seleccionar todas las filas visibles" @change="alternarTodas">
          </th>
          <th v-for="c in columnas" :key="c.clave" scope="col" :aria-sort="ariaSort(c)"
              :class="[`dt-${c.alinear ?? 'izquierda'}`, { 'dt-fija': c.clave === fija }]">
            <button v-if="c.ordenable" type="button" class="dt-orden" :class="{ activo: orden?.clave === c.clave }" @click="ordenar(c)">
              {{ c.titulo }}
              <svg viewBox="0 0 10 12" aria-hidden="true">
                <path d="M2 4.5 5 1.5l3 3" :class="{ on: orden?.clave === c.clave && orden.dir === 'asc' }" />
                <path d="M2 7.5l3 3 3-3" :class="{ on: orden?.clave === c.clave && orden.dir === 'desc' }" />
              </svg>
            </button>
            <template v-else>{{ c.titulo }}</template>
          </th>
        </tr>
      </thead>

      <tbody v-if="mostrarCarga">
        <tr v-for="n in filasCarga" :key="n" aria-hidden="true">
          <td v-if="seleccionable" class="dt-sel"><Skeleton forma="bloque" :alto="14" :ancho="14" etiqueta="" /></td>
          <td v-for="(c, i) in columnas" :key="c.clave" :class="{ 'dt-fija': c.clave === fija }">
            <Skeleton :lineas="1" :ancho="['70%', '90%', '55%', '80%'][(n + i) % 4]" etiqueta="" />
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="!filas.length">
        <tr class="dt-vacia">
          <td :colspan="totalColumnas">
            <slot name="vacio"><Vacio :titulo="vacio.titulo" :texto="vacio.texto" /></slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else :class="{ recargando: cargando }">
        <tr v-for="(f, i) in visibles" :key="clave(f)" :class="{ elegida: elegidas.has(clave(f)), clicable: filaClicable }"
            :aria-selected="seleccionable ? elegidas.has(clave(f)) : undefined" @click="clicFila(f, $event)">
          <td v-if="seleccionable" class="dt-sel">
            <input type="checkbox" :checked="elegidas.has(clave(f))" :aria-label="`Seleccionar ${nombreFila(f)}`" @click="alternar(f, i, $event)">
          </td>
          <td v-for="c in columnas" :key="c.clave" :class="[`dt-${c.alinear ?? 'izquierda'}`, { 'dt-mono': c.mono, 'dt-fija': c.clave === fija }]">
            <slot :name="`celda-${c.clave}`" :fila="f" :valor="f[c.clave]">{{ valor(c, f) ?? '—' }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="cargando" class="oculto" role="status">Cargando {{ titulo.toLowerCase() }}…</p>
  </div>
</template>

<style scoped>
.dt { position: relative; width: 100%; }
.dt:focus-visible { outline: 2px solid var(--senal); outline-offset: 2px; }
.desplazable { overflow: auto; }
table { table-layout: auto; }
th, td { white-space: nowrap; }
.compacta th, .compacta td { height: 36px; }
.compacta th { height: 30px; }
thead th { position: sticky; top: 0; z-index: 2; background: var(--panel); box-shadow: inset 0 -1px 0 var(--borde); }
.dt-fija { position: sticky; left: 0; z-index: 1; background: var(--panel); box-shadow: inset -1px 0 0 var(--borde); }
.sel .dt-fija { left: 44px; }
/* Ancho fijo de verdad: con layout automático el navegador la achica y la columna fija deja un hueco. */
.dt-sel { position: sticky; left: 0; z-index: 1; box-sizing: border-box; width: 44px; min-width: 44px; max-width: 44px; padding: 0 0 0 14px !important; background: var(--panel); }
thead .dt-sel, thead .dt-fija { z-index: 3; }
.dt-derecha { text-align: right !important; }
.dt-centro { text-align: center !important; }
.dt-mono { font: 500 .8rem var(--mono); }
tbody tr:hover td, tbody tr:hover .dt-fija, tbody tr:hover .dt-sel { background: var(--panel-2); }
tr.elegida td, tr.elegida .dt-fija, tr.elegida .dt-sel { background: color-mix(in srgb, var(--senal) 10%, var(--panel)); }
tr.clicable { cursor: pointer; }
.recargando { opacity: .5; transition: opacity .15s; }

.dt-orden { display: inline-flex; align-items: center; gap: 6px; margin: 0 -6px; padding: 4px 6px; border: 0; border-radius: var(--r-sm); background: none; font: inherit; letter-spacing: inherit; text-transform: inherit; color: inherit; }
.dt-orden:hover, .dt-orden.activo { color: var(--txt); background: var(--panel-2); }
.dt-derecha .dt-orden { flex-direction: row-reverse; }
.dt-orden svg { width: 8px; height: 10px; fill: none; stroke: var(--tenue); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.dt-orden svg .on { stroke: var(--senal); stroke-width: 2.2; }

.dt-vacia td { height: auto; padding: 28px 16px; white-space: normal; }
.dt-vacia:hover td { background: none; }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { .recargando { transition: none; } }
</style>
