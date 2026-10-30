<script setup>
import { computed, nextTick, ref } from 'vue';

// Tablero kanban: columnas con tarjetas que se arrastran de una a otra. El componente no modifica los datos:
// emite `mover` y la app decide (puede confirmar, pedir una nota o rechazar, incluso de forma asíncrona).
//   columnas      [{ id, titulo, tono?, limite? }]. Con `limite` la cabecera muestra «5 / 6» y pasa a aviso al superarlo.
//   items         tarjetas. `columna` es el campo que dice en qué columna está cada una; `clave`, su id.
//   puedeSoltar   (item, hacia) => true | false | { ok, motivo }. Las columnas bloqueadas se atenúan y dicen por qué.
//   ordenable     permite reordenar dentro de una columna; `mover` trae el `indice` de destino.
//   soloLectura   sin arrastre: solo mirar y abrir.
// Teclado: Espacio levanta la tarjeta, ← → eligen columna (↑ ↓ el lugar si es ordenable), Espacio o Enter
// la sueltan, Escape cancela. Enter sobre una tarjeta quieta la abre.
// Arrastre nativo del navegador: en pantallas táctiles no hay arrastre; se mueve con teclado.
const props = defineProps({
  columnas: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  columna: { type: String, default: 'estado' },
  clave: { type: String, default: 'id' },
  puedeSoltar: { type: Function, default: () => true },
  ordenable: Boolean,
  soloLectura: Boolean,
  etiqueta: { type: String, default: 'Tablero' },
});
const emit = defineEmits(['mover', 'abrir']);

const raiz = ref(null);
const arrastrado = ref(null); // item levantado (con el mouse o con el teclado)
const modo = ref(''); // 'raton' | 'teclado'
const destino = ref(null); // id de la columna donde caería
const indice = ref(null); // lugar dentro de la columna destino (solo si es ordenable)
const anuncio = ref(''); // para lectores de pantalla

const id = (it) => String(it[props.clave]);
const titulo = (colId) => props.columnas.find((c) => c.id === colId)?.titulo ?? colId;
const porColumna = computed(() => Object.fromEntries(props.columnas.map((c) => [c.id, props.items.filter((it) => it[props.columna] === c.id)])));
// La columna destino sin la tarjeta que se mueve: sobre esa lista se cuenta el índice.
const sinArrastrado = (colId) => porColumna.value[colId].filter((it) => it !== arrastrado.value);

function regla(item, hacia) {
  if (hacia === item[props.columna]) return { ok: true };
  const r = props.puedeSoltar(item, hacia);
  return r && typeof r === 'object' ? { ok: !!r.ok, motivo: r.motivo || '' } : { ok: r !== false, motivo: '' };
}

function claseColumna(c) {
  const lim = c.limite && porColumna.value[c.id].length > c.limite;
  if (!arrastrado.value) return [c.tono && `tono-${c.tono}`, { 'kb-excedida': lim }];
  const origen = c.id === arrastrado.value[props.columna];
  return [c.tono && `tono-${c.tono}`, {
    'kb-excedida': lim, 'kb-origen': origen, 'kb-sobre': destino.value === c.id,
    'kb-valida': !origen && regla(arrastrado.value, c.id).ok, 'kb-bloqueada': !origen && !regla(arrastrado.value, c.id).ok,
  }];
}

// Pista escrita mientras se mueve: a dónde puede ir, o por qué no puede ir donde está apuntando.
const pista = computed(() => {
  const it = arrastrado.value;
  if (!it) return '';
  const desde = it[props.columna];
  if (destino.value && destino.value !== desde) {
    const r = regla(it, destino.value);
    if (!r.ok) return `No se puede pasar a «${titulo(destino.value)}»${r.motivo ? `: ${r.motivo}` : '.'}`;
  }
  const validas = props.columnas.filter((c) => c.id !== desde && regla(it, c.id).ok).map((c) => c.titulo);
  return validas.length ? `Desde «${titulo(desde)}» se puede pasar a: ${validas.join(', ')}` : `Desde «${titulo(desde)}» no se puede mover`;
});

// Marca dónde cae la tarjeta: una línea antes de la tarjeta `antesDe` o al final de la columna.
const antesDe = computed(() => {
  if (!props.ordenable || !arrastrado.value || destino.value == null || indice.value == null) return null;
  const lista = sinArrastrado(destino.value);
  return indice.value < lista.length ? id(lista[indice.value]) : 'final';
});

function limpiar() {
  arrastrado.value = null;
  modo.value = '';
  destino.value = null;
  indice.value = null;
}

function soltar() {
  const it = arrastrado.value;
  const hacia = destino.value;
  if (!it || hacia == null) return limpiar();
  const desde = it[props.columna];
  const r = regla(it, hacia);
  if (!r.ok) {
    anuncio.value = `No se puede pasar a ${titulo(hacia)}. ${r.motivo}`;
    return limpiar();
  }
  const idx = props.ordenable ? indice.value ?? sinArrastrado(hacia).length : undefined;
  const mismoLugar = desde === hacia && (!props.ordenable || porColumna.value[hacia].indexOf(it) === idx);
  const teclado = modo.value === 'teclado';
  limpiar();
  if (mismoLugar) return;
  emit('mover', { item: it, desde, hacia, indice: idx });
  anuncio.value = `Movida a ${titulo(hacia)}.`;
  // Con teclado, el foco sigue a la tarjeta adonde haya quedado (si la app la movió).
  if (teclado) nextTick(() => raiz.value?.querySelector(`[data-clave="${CSS.escape(id(it))}"]`)?.focus());
}

// Mouse
function alEmpezar(e, it) {
  if (props.soloLectura) return e.preventDefault();
  arrastrado.value = it;
  modo.value = 'raton';
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id(it)); // sin datos, Firefox no arrastra
}
function alPasar(e, colId) {
  if (modo.value !== 'raton') return;
  destino.value = colId;
  const ok = regla(arrastrado.value, colId).ok;
  e.dataTransfer.dropEffect = ok ? 'move' : 'none';
  if (ok) e.preventDefault(); // solo se puede soltar donde la regla lo permite
  if (props.ordenable && ok) {
    const tarjetas = [...e.currentTarget.querySelectorAll('[data-clave]')].filter((el) => el.dataset.clave !== id(arrastrado.value));
    const i = tarjetas.findIndex((el) => { const r = el.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
    indice.value = i === -1 ? tarjetas.length : i;
  }
}
function alSalir(e, colId) {
  if (destino.value === colId && !e.currentTarget.contains(e.relatedTarget)) destino.value = null;
}

// Teclado
function alTecla(e, it) {
  const levantada = arrastrado.value === it && modo.value === 'teclado';
  if (!levantada) {
    if (e.key === 'Enter') { e.preventDefault(); emit('abrir', it); }
    if (e.key === ' ' && !props.soloLectura) {
      e.preventDefault();
      arrastrado.value = it;
      modo.value = 'teclado';
      destino.value = it[props.columna];
      indice.value = porColumna.value[destino.value].indexOf(it);
      anuncio.value = `Levantaste ${it[props.clave]}, en ${titulo(destino.value)}. Flechas para elegir la columna, Espacio para soltar, Escape para cancelar.`;
    }
    return;
  }
  const ids = props.columnas.map((c) => c.id);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const i = Math.min(ids.length - 1, Math.max(0, ids.indexOf(destino.value) + (e.key === 'ArrowRight' ? 1 : -1)));
    destino.value = ids[i];
    indice.value = sinArrastrado(destino.value).length;
    const r = regla(it, destino.value);
    anuncio.value = `${titulo(destino.value)}: ${r.ok ? 'se puede soltar' : `no se puede${r.motivo ? `, ${r.motivo}` : ''}`}.`;
  } else if (props.ordenable && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault();
    const max = sinArrastrado(destino.value).length;
    indice.value = Math.min(max, Math.max(0, (indice.value ?? max) + (e.key === 'ArrowDown' ? 1 : -1)));
    anuncio.value = `Lugar ${indice.value + 1} de ${max + 1}.`;
  } else if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    soltar();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    limpiar();
    anuncio.value = 'Movimiento cancelado.';
  }
}
</script>

<template>
  <div ref="raiz" class="kb" :class="{ 'kb-moviendo': arrastrado }">
    <p v-if="pista" class="kb-pista" aria-hidden="true">{{ pista }}</p>
    <p class="kb-oculto" aria-live="assertive">{{ anuncio }}</p>
    <div class="kb-columnas" role="group" :aria-label="etiqueta">
      <section v-for="c in columnas" :key="c.id" class="kb-columna" :class="claseColumna(c)" :aria-label="c.titulo"
               @dragover="alPasar($event, c.id)" @dragleave="alSalir($event, c.id)" @drop.prevent="soltar">
        <header class="kb-cabecera">
          <slot name="cabecera" :columna="c" :items="porColumna[c.id]">
            <h3><i v-if="c.tono" class="kb-marca"></i>{{ c.titulo }}</h3>
            <span class="kb-cuenta">{{ porColumna[c.id].length }}<template v-if="c.limite"> / {{ c.limite }}</template></span>
          </slot>
        </header>
        <div class="kb-lista" :class="{ 'kb-al-final': antesDe === 'final' && destino === c.id }">
          <article v-for="it in porColumna[c.id]" :key="id(it)" class="kb-tarjeta encuadre" tabindex="0" :data-clave="id(it)"
                   :draggable="!soloLectura" :aria-grabbed="arrastrado === it ? 'true' : undefined"
                   :class="{ 'kb-levantada': arrastrado === it, 'kb-antes': antesDe === id(it) }"
                   @dragstart="alEmpezar($event, it)" @dragend="limpiar" @click="emit('abrir', it)" @keydown="alTecla($event, it)">
            <slot name="tarjeta" :item="it" :arrastrando="arrastrado === it">
              <span v-if="it.codigo" class="kb-codigo">{{ it.codigo }}</span>
              <span class="kb-titulo">{{ it.titulo ?? it[clave] }}</span>
            </slot>
          </article>
          <slot v-if="!porColumna[c.id].length" name="vacio" :columna="c"><p class="kb-vacio">Sin tarjetas</p></slot>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.kb { display: grid; gap: 8px; min-width: 0; }
.kb-pista { margin: 0; font: 600 .72rem var(--mono); letter-spacing: .04em; color: var(--senal); }
.kb-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.kb-columnas { display: flex; overflow-x: auto; align-items: stretch; border: 1px solid var(--borde); border-radius: var(--r-lg); background: var(--bg); }
.kb-columna { --c: var(--sub); display: flex; flex-direction: column; flex: 0 0 272px; min-width: 0; padding: 0 10px 14px; border-right: 1px solid var(--borde); transition: background-color .12s, opacity .12s; }
.kb-columna:last-child { border-right: 0; }
.kb-columna.tono-ok { --c: var(--ok); } .kb-columna.tono-info { --c: var(--info); } .kb-columna.tono-aviso { --c: var(--aviso); } .kb-columna.tono-error { --c: var(--error); }
.kb-cabecera { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 0 -10px 10px; padding: 12px 12px 10px; border-bottom: 1px solid var(--borde); }
.kb-cabecera h3 { display: flex; align-items: center; gap: 8px; min-width: 0; margin: 0; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.kb-marca { width: 8px; height: 8px; flex: none; background: var(--c); }
.kb-cuenta { font: 600 .72rem var(--mono); color: var(--txt); font-variant-numeric: tabular-nums; }
.kb-excedida .kb-cuenta { color: color-mix(in srgb, var(--aviso) 80%, var(--txt)); }
.kb-excedida .kb-cuenta::before { content: "▲ "; }
.kb-lista { flex: 1; display: grid; gap: 8px; align-content: start; min-height: 72px; }

/* Tarjeta: quieta es un panel calmo; el encuadre aparece solo al levantarla */
.kb-tarjeta { --encuadre-color: transparent; position: relative; display: grid; gap: 4px; padding: 10px 12px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-md); cursor: grab; transition: border-color .12s, transform .12s, opacity .12s; }
.kb-tarjeta:hover { border-color: var(--borde-fuerte); }
.kb-tarjeta:focus-visible { outline: 2px solid var(--senal); outline-offset: 1px; }
.kb-tarjeta.kb-levantada { --encuadre-color: var(--senal); border-color: color-mix(in srgb, var(--senal) 55%, transparent); transform: translateY(-2px); box-shadow: var(--sombra-1); }
.kb-moviendo .kb-tarjeta.kb-levantada:active { cursor: grabbing; }
.kb-codigo { font: 700 .72rem var(--mono); letter-spacing: .06em; color: var(--sub); }
.kb-titulo { font-size: .86rem; line-height: 1.35; }
.kb-vacio { margin: 0; padding: 14px 4px; font-size: .8rem; color: var(--tenue); text-align: center; border: 1px dashed var(--borde); }

/* Mientras se mueve: válidas con la señal, bloqueadas atenuadas, origen sin cambios */
.kb-columna.kb-valida { background: color-mix(in srgb, var(--senal) 5%, transparent); }
.kb-columna.kb-valida.kb-sobre { background: color-mix(in srgb, var(--senal) 11%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--senal) 55%, transparent); }
.kb-columna.kb-bloqueada { opacity: .45; }
.kb-columna.kb-bloqueada.kb-sobre { opacity: .6; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--error) 50%, transparent); }
/* Lugar donde cae, si el tablero es ordenable */
.kb-tarjeta.kb-antes::before, .kb-al-final::after { content: ""; display: block; height: 2px; background: var(--senal); }
.kb-tarjeta.kb-antes::before { position: absolute; left: 0; right: 0; top: -6px; }
@media (max-width: 600px) { .kb-columna { flex-basis: 240px; } }
@media (prefers-reduced-motion: reduce) { .kb-columna, .kb-tarjeta { transition: none; } .kb-tarjeta.kb-levantada { transform: none; } }
</style>
