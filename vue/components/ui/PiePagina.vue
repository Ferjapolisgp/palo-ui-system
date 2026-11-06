<script setup>
import { ref } from 'vue';
import Icono from './Icono.vue';

// Pie de la app o de una vista: una fila de elementos de tres tipos, todos con la misma estructura
// (etiqueta chica en mono + contenido) y separados por líneas. Va en dos grupos: `inicio` y `fin`.
// item: { tipo: 'kpi' | 'dato' | 'enlace', etiqueta?, ... }
//   kpi:    { valor, unidad?, tono? }        cifra para mirar de reojo; el tono suma un ícono, no solo color.
//   dato:   { valor, copiable? }             texto fijo (versión, entorno, ID); copiable lo copia al portapapeles.
//   enlace: { texto, href?, externo?, valor? }  con href es un enlace; sin él, un botón que emite `abrir`.
// Con `enlace` (por ejemplo RouterLink) los ítems cuyo href empieza con «/» se dibujan con ese componente.
// `fijo` lo pega abajo de la ventana. Slots `inicio` y `fin` suman contenido propio a cada grupo.
const props = defineProps({
  inicio: { type: Array, default: () => [] },
  fin: { type: Array, default: () => [] },
  fijo: Boolean,
  enlace: [Object, String],
  etiqueta: { type: String, default: 'Pie' },
});
const emit = defineEmits(['abrir', 'copiar']);

const ICONO_TONO = { ok: 'ok', aviso: 'alerta', error: 'error', info: 'info' };
const copiado = ref('');
let reloj;

const esRuta = (it) => props.enlace && typeof it.href === 'string' && it.href.startsWith('/');
const etiquetaDe = (it) => (esRuta(it) ? props.enlace : 'a');
const atributosEnlace = (it) => (esRuta(it) ? { to: it.href } : { href: it.href, ...(it.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}) });

async function copiar(it) {
  try { await navigator.clipboard.writeText(String(it.valor)); } catch { /* sin permiso: igual se avisa a la app */ }
  copiado.value = it.etiqueta || String(it.valor);
  clearTimeout(reloj);
  reloj = setTimeout(() => { copiado.value = ''; }, 1600);
  emit('copiar', it);
}
</script>

<template>
  <footer class="pie" :class="{ fijo }" :aria-label="etiqueta">
    <template v-for="(grupo, g) in [inicio, fin]" :key="g">
      <ul class="pie-grupo" :class="g === 1 && 'fin'">
        <li v-for="(it, i) in grupo" :key="i" class="pie-it" :class="[`it-${it.tipo}`, it.tono && `tono-${it.tono}`]">
          <template v-if="it.tipo === 'enlace'">
            <component :is="it.href ? etiquetaDe(it) : 'button'" v-bind="it.href ? atributosEnlace(it) : { type: 'button' }" class="pie-enlace" @click="!it.href && emit('abrir', it)">{{ it.texto }}</component>
          </template>
          <template v-else>
            <span v-if="it.etiqueta" class="pie-et">{{ it.etiqueta }}</span>
            <button v-if="it.tipo === 'dato' && it.copiable" type="button" class="pie-val pie-copiar" :title="`Copiar ${it.etiqueta || 'valor'}`" @click="copiar(it)">{{ it.valor }}<Icono nombre="copiar" :tam="12" /></button>
            <span v-else class="pie-val">
              <Icono v-if="it.tono && ICONO_TONO[it.tono]" :nombre="ICONO_TONO[it.tono]" :tam="13" />{{ it.valor }}<small v-if="it.unidad">{{ it.unidad }}</small>
            </span>
          </template>
        </li>
        <li v-if="g === 0 && $slots.inicio" class="pie-it"><slot name="inicio" /></li>
        <li v-if="g === 1 && $slots.fin" class="pie-it"><slot name="fin" /></li>
      </ul>
    </template>
    <span class="pie-aviso" role="status" aria-live="polite">{{ copiado ? `${copiado} copiado` : '' }}</span>
  </footer>
</template>

<style scoped>
.pie { position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 20px; min-height: 40px; padding: 6px 20px; background: var(--panel); border-top: 1px solid var(--borde); font-size: .8rem; }
.pie.fijo { position: sticky; bottom: 0; z-index: var(--capa-panel); }
.pie-grupo { display: flex; flex-wrap: wrap; align-items: center; margin: 0; padding: 0; list-style: none; min-width: 0; }
.pie-grupo.fin { margin-left: auto; justify-content: flex-end; }
.pie-it { display: flex; align-items: baseline; gap: 8px; padding: 2px 14px; min-width: 0; }
.pie-it + .pie-it { border-left: 1px solid var(--borde); }
.pie-grupo > .pie-it:first-child { padding-left: 0; }
.pie-grupo > .pie-it:last-child { padding-right: 0; }
.pie-et { font: 600 .62rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); white-space: nowrap; }
.pie-val { display: inline-flex; align-items: center; gap: 5px; font-variant-numeric: tabular-nums; color: var(--txt); white-space: nowrap; }
.it-kpi .pie-val { font-weight: 700; }
.it-dato .pie-val { font: 500 .76rem var(--mono); letter-spacing: .02em; }
.pie-val small { font-size: .7rem; font-weight: 500; color: var(--sub); }
.pie-copiar { padding: 0; border: 0; background: none; cursor: pointer; }
.pie-copiar:hover { background: none; color: var(--txt); }
.pie-copiar :deep(.icono-svg) { color: var(--tenue); }
.pie-enlace { padding: 0; border: 0; background: none; color: var(--sub); font: inherit; text-decoration: none; cursor: pointer; }
.pie-enlace:hover { background: none; color: var(--txt); text-decoration: underline; }
.tono-ok .pie-val { --c: var(--ok); } .tono-aviso .pie-val { --c: var(--aviso); } .tono-error .pie-val { --c: var(--error); } .tono-info .pie-val { --c: var(--info); }
.pie-it[class*="tono-"] .pie-val { color: color-mix(in srgb, var(--c) 78%, var(--txt)); }
.pie-aviso { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 640px) { .pie { padding: 8px 14px; } .pie-grupo.fin { margin-left: 0; justify-content: flex-start; } }
</style>
