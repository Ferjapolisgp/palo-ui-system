<script setup>
import { computed } from 'vue';
import Advertencia from './Advertencia.vue';

// Tarjeta de un proceso en marcha (importación, carga en lote, alta por etapas, flujo de pasos, firma con plazo).
// No ejecuta nada ni mide tiempos: la app pasa el estado y los números, y pone los botones en `acciones`.
// estado: 'cola' | 'curso' | 'pausa' | 'detenido' | 'aviso' | 'error' | 'ok'. Cada uno lleva símbolo y texto
// («● En curso»); `etiquetaEstado` cambia el texto («Con errores»). El tono tiñe las esquinas de encuadre.
// El cuerpo se arma con lo que se pase (puede combinarse): `avance` (0–100: cifra y barra), `segmentos`
// ({ texto, valor, tono: 'ok' | 'error' | 'resto' }: barra partida con sus cantidades escritas), `etapas`
// ({ texto, estado: 'hecha' | 'actual' | 'pendiente' }), `celdas` ('ok' | 'error' | 'pend', o { estado, texto }:
// una grilla; con `celdasMini` son cubos de solo color para cientos de pasos) y `vence` (banda de advertencia).
// variante 'panel': cifra grande, medidor de 25 segmentos y `lecturas` ({ etiqueta, valor }), con marco de corte.
// El panel dibuja líneas fuera de su caja: deja ese espacio libre alrededor (la tarjeta ya lo reserva con margen).
const props = defineProps({
  codigo: String,
  titulo: String,
  detalle: String,
  estado: { type: String, default: 'curso', validator: (v) => ['cola', 'curso', 'pausa', 'detenido', 'aviso', 'error', 'ok'].includes(v) },
  etiquetaEstado: String,
  variante: { type: String, default: 'normal' }, // 'normal' | 'panel'
  avance: Number,
  cifra: [String, Number], // reemplaza al porcentaje en la cifra grande
  unidad: String, // se pega a la cifra: «cobros»
  conteo: String, // texto a la derecha de la cifra: «112 / 180 archivos»
  segmentos: { type: Array, default: () => [] },
  etapas: { type: Array, default: () => [] },
  celdas: { type: Array, default: () => [] },
  celdasMini: Boolean,
  resaltar: String, // 'error': atenúa las celdas correctas para ver las que fallaron
  nombresCeldas: { type: Object, default: () => ({ ok: 'Correctos', error: 'Con error', pend: 'Pendientes' }) },
  leyenda: Boolean, // cantidades escritas bajo la grilla
  lecturas: { type: Array, default: () => [] },
  vence: String,
  venceTono: { type: String, default: 'aviso' }, // 'aviso' | 'error'
  venceAnimada: Boolean,
});

const TONO = { cola: 'espera', curso: 'curso', pausa: 'info', detenido: 'aviso', aviso: 'aviso', error: 'error', ok: 'ok' };
const TEXTO = { cola: '◷ En cola', curso: '● En curso', pausa: '❚❚ En pausa', detenido: '■ Detenido', aviso: '▲ Por vencer', error: '✕ Con error', ok: '✓ Completado' };
const tono = computed(() => TONO[props.estado]);
const texto = computed(() => props.etiquetaEstado || TEXTO[props.estado]);
const panel = computed(() => props.variante === 'panel');

const pct = computed(() => Math.min(100, Math.max(0, props.avance ?? 0)));
const SEGS = 25;
const encendidos = computed(() => Math.round((pct.value / 100) * SEGS));

const totalSegmentos = computed(() => props.segmentos.reduce((s, x) => s + x.valor, 0) || 1);
const celdasN = computed(() => props.celdas.map((c) => (typeof c === 'string' ? { estado: c } : c)));
const cuentas = computed(() => {
  const n = { ok: 0, error: 0, pend: 0 };
  for (const c of celdasN.value) n[c.estado in n ? c.estado : 'pend']++;
  return n;
});
const etiquetaCeldas = computed(() => {
  const n = cuentas.value, t = props.nombresCeldas;
  return `${n.ok} ${t.ok.toLowerCase()}, ${n.error} ${t.error.toLowerCase()}, ${n.pend} ${t.pend.toLowerCase()} de ${celdasN.value.length}`;
});
</script>

<template>
  <article class="proceso encuadre" :class="[`tono-${tono}`, { 'es-panel': panel, 'marco-corte': panel }]">
    <header class="p-cab">
      <span v-if="codigo" class="p-cod">{{ codigo }}</span>
      <span class="p-tag">{{ texto }}</span>
    </header>

    <div v-if="titulo || detalle" class="p-tit">
      <b v-if="titulo">{{ titulo }}</b>
      <small v-if="detalle">{{ detalle }}</small>
    </div>

    <Advertencia v-if="vence" bloque :tono="venceTono" :animada="venceAnimada">{{ vence }}</Advertencia>

    <!-- Avance: cifra + barra, o cifra grande + medidor en el panel -->
    <template v-if="avance != null || cifra != null">
      <div class="p-lectura">
        <span class="p-cifra">{{ cifra ?? Math.round(pct) }}<small v-if="unidad || cifra == null">{{ cifra == null ? ' %' : ` ${unidad}` }}</small></span>
        <span v-if="conteo" class="p-meta">{{ conteo }}</span>
      </div>
      <div v-if="avance != null && !panel" class="p-barra" role="progressbar" :aria-valuenow="Math.round(pct)" aria-valuemin="0" aria-valuemax="100" :aria-label="titulo || 'Avance'"><i :style="{ width: pct + '%' }" /></div>
      <div v-else-if="avance != null" class="p-segs" role="progressbar" :aria-valuenow="Math.round(pct)" aria-valuemin="0" aria-valuemax="100" :aria-label="titulo || 'Avance'">
        <i v-for="n in SEGS" :key="n" :class="{ on: n <= encendidos }" />
      </div>
    </template>

    <!-- Barra partida: cada parte con su cantidad escrita; lo que falta va en trama -->
    <template v-if="segmentos.length">
      <div class="p-barra gruesa" role="img" :aria-label="segmentos.map((s) => `${s.valor} ${s.texto.toLowerCase()}`).join(', ')">
        <i v-for="s in segmentos" :key="s.texto" :class="`s-${s.tono || 'resto'}`" :style="{ width: (s.valor / totalSegmentos) * 100 + '%' }" />
      </div>
      <ul class="p-leyenda">
        <li v-for="s in segmentos" :key="s.texto"><span class="p-marca" :class="`s-${s.tono || 'resto'}`" aria-hidden="true" />{{ s.texto }} <b>{{ s.valor }}</b></li>
      </ul>
    </template>

    <!-- Etapas: tira de tramos + lista con símbolo por estado -->
    <template v-if="etapas.length">
      <div class="p-tira" :style="{ '--n': etapas.length }" aria-hidden="true"><i v-for="(e, i) in etapas" :key="i" :class="`e-${e.estado || 'pendiente'}`" /></div>
      <ol class="p-etapas" aria-label="Etapas">
        <li v-for="(e, i) in etapas" :key="i" :class="`e-${e.estado || 'pendiente'}`" :aria-current="e.estado === 'actual' ? 'step' : undefined">{{ e.texto }}</li>
      </ol>
    </template>

    <!-- Celdas: una por cupo o paso. Normales llevan ✓ / ✕; las mini, solo color -->
    <template v-if="celdas.length">
      <div class="p-celdas" :class="{ mini: celdasMini, 'solo-error': resaltar === 'error' }" role="img" :aria-label="etiquetaCeldas">
        <i v-for="(c, i) in celdasN" :key="i" :class="c.estado" :title="c.texto" />
      </div>
      <ul v-if="leyenda" class="p-leyenda">
        <li v-for="k in ['ok', 'error', 'pend']" :key="k"><span class="p-marca" :class="`c-${k}`" aria-hidden="true" />{{ nombresCeldas[k] }} <b>{{ cuentas[k] }}</b></li>
      </ul>
    </template>

    <dl v-if="lecturas.length" class="p-lecturas">
      <div v-for="l in lecturas" :key="l.etiqueta"><dt>{{ l.etiqueta }}</dt><dd>{{ l.valor }}</dd></div>
    </dl>

    <slot />

    <footer v-if="$slots.pie || $slots.acciones" class="p-pie">
      <span class="p-meta"><slot name="pie" /></span>
      <div v-if="$slots.acciones" class="p-acciones"><slot name="acciones" /></div>
    </footer>
  </article>
</template>

<style scoped>
.proceso { --c: var(--tenue); --encuadre-color: var(--c); position: relative; display: grid; gap: 12px; align-content: start; min-width: 0; padding: 14px 16px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.tono-espera { --c: var(--e-espera); } .tono-curso { --c: var(--e-curso); } .tono-info { --c: var(--info); }
.tono-aviso { --c: var(--aviso); } .tono-error { --c: var(--error); } .tono-ok { --c: var(--ok); }
/* El marco de corte sale de la caja: la tarjeta reserva ese espacio */
.es-panel { margin: calc(var(--corte-sep) + var(--corte-ext)); gap: 14px; }

.p-cab { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.p-cod { font: 700 .72rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); }
.p-tag { margin-left: auto; padding: 2px 8px; background: color-mix(in srgb, var(--c) 16%, transparent); font: 600 .72rem/1.3 var(--ui); white-space: nowrap; color: color-mix(in srgb, var(--c) 80%, var(--txt)); }
.p-tit { display: grid; gap: 2px; min-width: 0; }
.p-tit b { font-weight: 600; font-size: .95rem; line-height: 1.3; overflow-wrap: anywhere; }
.p-tit small { color: var(--sub); font-size: .8rem; overflow-wrap: anywhere; }

.p-lectura { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.p-cifra { font: 600 1.5rem/1 var(--mono); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.p-cifra small { font-size: .8rem; font-weight: 500; letter-spacing: 0; color: var(--sub); }
.es-panel .p-cifra { font-size: 3.6rem; letter-spacing: -.04em; }
.es-panel .p-cifra small { font-size: 1.2rem; }
.p-meta { font: 500 .72rem var(--mono); letter-spacing: .04em; color: var(--sub); font-variant-numeric: tabular-nums; }
.p-meta :slotted(b), .p-leyenda b { color: var(--txt); font-weight: 600; }

.p-barra { height: 6px; display: flex; overflow: hidden; background: var(--panel-2); }
.p-barra.gruesa { height: 10px; }
.p-barra > i { display: block; height: 100%; background: var(--c); transition: width .12s linear; }
.p-barra > i.s-ok { background: var(--ok); } .p-barra > i.s-error { background: var(--error); }
.p-barra > i.s-resto { flex: 1; background: var(--trama); }
.p-leyenda { display: flex; flex-wrap: wrap; gap: 4px 14px; margin: 0; padding: 0; list-style: none; font-size: .75rem; color: var(--sub); }
.p-leyenda b { font: 600 .75rem var(--mono); font-variant-numeric: tabular-nums; }
.p-marca { display: inline-block; width: 8px; height: 8px; margin-right: 5px; }
.p-marca.s-ok, .p-marca.c-ok { background: var(--ok); } .p-marca.s-error, .p-marca.c-error { background: var(--error); }
.p-marca.s-resto { background: var(--trama); } .p-marca.c-pend { border: 1px solid var(--borde-fuerte); width: 10px; height: 10px; vertical-align: -1px; }

.p-segs { display: grid; grid-template-columns: repeat(25, minmax(0, 1fr)); gap: 2px; height: 22px; }
.p-segs > i { background: var(--panel-2); } .p-segs > i.on { background: var(--c); }

.p-tira { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 3px; }
.p-tira > i { height: 6px; background: var(--panel-2); } .p-tira > i.e-hecha { background: var(--sub); } .p-tira > i.e-actual { background: var(--c); }
.p-etapas { display: grid; gap: 3px; margin: 0; padding: 0; list-style: none; font-size: .8rem; }
.p-etapas li { display: flex; gap: 8px; color: var(--tenue); }
.p-etapas li::before { content: "○"; font-family: var(--mono); }
.p-etapas li.e-hecha { color: var(--sub); } .p-etapas li.e-hecha::before { content: "✓"; }
.p-etapas li.e-actual { color: var(--txt); font-weight: 600; } .p-etapas li.e-actual::before { content: "●"; color: var(--c); }

.p-celdas { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4px; }
.p-celdas > i { aspect-ratio: 1; display: grid; place-items: center; font: 700 .68rem var(--mono); font-style: normal; border: 1px solid var(--borde-fuerte); }
.p-celdas > i.ok, .p-celdas > i.error { --k: var(--ok); background: color-mix(in srgb, var(--k) 20%, transparent); border-color: color-mix(in srgb, var(--k) 55%, transparent); color: color-mix(in srgb, var(--k) 80%, var(--txt)); }
.p-celdas > i.error { --k: var(--error); }
.p-celdas > i.ok::before { content: "✓"; } .p-celdas > i.error::before { content: "✕"; }
/* Mini: cubos de 8 px que se acomodan al ancho, solo color; el estado va escrito en la leyenda o el pie */
.p-celdas.mini { grid-template-columns: repeat(auto-fill, 8px); gap: 2px; justify-content: start; }
.p-celdas.mini > i { width: 8px; height: 8px; aspect-ratio: auto; border-color: var(--borde); }
.p-celdas.mini > i.ok, .p-celdas.mini > i.error { background: color-mix(in srgb, var(--k) 45%, transparent); border-color: color-mix(in srgb, var(--k) 75%, transparent); }
.p-celdas.mini > i::before { content: none !important; }
.p-celdas.solo-error > i.ok { opacity: .2; }

.p-lecturas { display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); margin: 0; border: 1px solid var(--borde); }
.p-lecturas > div { display: grid; gap: 2px; padding: 8px 10px; border-right: 1px solid var(--borde); }
.p-lecturas > div:last-child { border-right: 0; }
.p-lecturas dt { font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.p-lecturas dd { margin: 0; font: 600 1rem var(--mono); font-variant-numeric: tabular-nums; }

.p-pie { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 12px; padding-top: 10px; border-top: 1px solid var(--borde); }
.p-acciones { display: flex; flex-wrap: wrap; gap: 8px; margin-left: auto; }
@media (prefers-reduced-motion: reduce) { .p-barra > i { transition: none; } }
</style>
