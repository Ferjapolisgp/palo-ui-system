<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { formatoNumero, formatoPorcentaje, posicion } from '../../lib/graficos.js';

// Un número clave con su variación. La flecha y el texto dicen si subió o bajó; `tono` dice si eso es bueno o malo.
// Al pie lleva un gráfico mínimo, a sangre y sin ejes, según `forma`:
//   linea       curva del período (`tendencia`)
//   barras      una barra por punto del período (`tendencia`)
//   composicion de qué se compone el total (`partes`: [{ nombre, valor, resto? }], hasta 4; `resto` va en trama gris)
//   tope        cuánto se usó de un límite (`usado` y `limite`); lo libre va en trama
// `grafico` elige el color: 'degrade' marca del mínimo (tenue) al máximo (serie 1); 'solido' usa colores parejos.
// Sin tooltip: al pasar el puntero, el número y la variación pasan a ser los del punto o la parte.
const props = defineProps({
  etiqueta: { type: String, required: true },
  valor: { type: [String, Number], required: true },
  variacion: String,
  tono: String,
  forma: { type: String, default: 'linea', validator: (v) => ['linea', 'barras', 'composicion', 'tope'].includes(v) },
  tendencia: Array,
  etiquetasTendencia: Array,
  partes: Array,
  usado: Number,
  limite: Number,
  avisoDesde: { type: Number, default: 85 },
  formato: { type: Function, default: formatoNumero },
  grafico: { type: String, default: 'degrade', validator: (v) => ['degrade', 'solido'].includes(v) },
});

const id = useId();
const caja = ref(null);
const svg = ref(null);
const medida = ref({ W: 0, H: 0 });
let ro;
onMounted(() => {
  if (!caja.value) return;
  ro = new ResizeObserver(([e]) => { medida.value = { W: Math.round(e.contentRect.width), H: Math.round(e.contentRect.height) }; });
  ro.observe(caja.value);
});
onBeforeUnmount(() => ro?.disconnect());

const hover = ref(null);
const serie = computed(() => ['linea', 'barras'].includes(props.forma) && props.tendencia?.length > 1);
const degrade = computed(() => props.grafico === 'degrade');
// Del mínimo al máximo: 0 → tenue, 1 → serie 1.
const tinte = (t) => `color-mix(in srgb, var(--serie-1) ${Math.round(30 + t * 70)}%, var(--tenue))`;

// Línea y barras comparten escala.
const PY = 6; // aire arriba y abajo para el trazo y el punto
const g = computed(() => {
  if (!serie.value) return null;
  const vals = props.tendencia, n = vals.length, W = Math.max(medida.value.W, 100), H = Math.max(medida.value.H, 44);
  const min = Math.min(...vals), max = Math.max(...vals), rango = max - min || 1;
  const t = (v) => (v - min) / rango;
  if (props.forma === 'barras') {
    // Las barras arrancan de cero, no del mínimo: el alto tiene que ser proporcional.
    const paso = W / n, ancho = Math.max(2, paso * 0.62), tope = max || 1;
    const barras = vals.map((v, i) => { const h = Math.max(2, v / tope * (H - PY)); return { x: i * paso + (paso - ancho) / 2, y: H - h, w: ancho, h, t: t(v) }; });
    return { W, H, n, vals, paso, barras };
  }
  const px = (i) => i * W / (n - 1), py = (v) => PY + (1 - t(v)) * (H - 2 * PY);
  const linea = curva(vals.map((v, i) => [px(i), py(v)]));
  return { W, H, n, vals, px, py, linea, area: `${linea}L${W},${H}L0,${H}Z`, yMax: py(max), yMin: py(min) };
});

// Curva monótona (Fritsch–Carlson): ondula entre puntos sin pasarse del mínimo ni del máximo reales.
function curva(pts) {
  const n = pts.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  // En picos y valles la pendiente es 0; en el resto, la media armónica de los dos tramos.
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : 2 / (1 / d[i - 1] + 1 / d[i]);
  const f = (v) => v.toFixed(1);
  let s = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], h = (x1 - x0) / 3;
    s += `C${f(x0 + h)},${f(y0 + m[i] * h)} ${f(x1 - h)},${f(y1 - m[i + 1] * h)} ${f(x1)},${f(y1)}`;
  }
  return s;
}

function mover(e) {
  const { W, n } = g.value, x = posicion(e, svg.value)[0];
  hover.value = Math.max(0, Math.min(n - 1, props.forma === 'barras' ? Math.floor(x / g.value.paso) : Math.round(x / W * (n - 1))));
}

// Composición: partes en porcentaje del total. Degradé: un solo tono, más fuerte cuanto más pesa la parte;
// sólido: la paleta de series en orden fijo.
const comp = computed(() => {
  if (props.forma !== 'composicion' || !props.partes?.length) return null;
  const partes = props.partes.slice(0, 4), total = partes.reduce((s, p) => s + p.valor, 0) || 1;
  // El resto no entra en el orden del degradé: no es un dato principal.
  const orden = partes.filter((p) => !p.resto).sort((a, b) => b.valor - a.valor);
  return partes.map((p, i) => ({ ...p, pct: p.valor / total * 100,
    color: p.resto ? 'var(--trama)' : degrade.value ? tinte(1 - orden.indexOf(p) / Math.max(1, orden.length - 1)) : `var(--serie-${i + 1})` }));
});

// Tope: aviso desde `avisoDesde`, error al superarlo; el estado siempre escrito.
const tope = computed(() => {
  if (props.forma !== 'tope' || props.usado == null || !props.limite) return null;
  const pct = props.usado / props.limite * 100;
  const estado = pct > 100 ? 'error' : pct >= props.avisoDesde ? 'aviso' : 'ok';
  return { pct, ancho: Math.min(pct, 100), estado, texto: { ok: 'Dentro del tope', aviso: 'Cerca del tope', error: 'Superó el tope' }[estado] };
});

const mostrado = computed(() => {
  if (hover.value == null) return props.valor;
  if (comp.value) return formatoPorcentaje(comp.value[hover.value].pct);
  return props.formato(g.value.vals[hover.value]);
});
const detalle = computed(() => {
  if (hover.value == null) return props.variacion;
  if (comp.value) return `${comp.value[hover.value].nombre} · ${props.formato(comp.value[hover.value].valor)}`;
  return props.etiquetasTendencia?.[hover.value] ?? `Punto ${hover.value + 1}`;
});
</script>

<template>
  <div class="indicador" :class="[tono, `forma-${forma}`]">
    <p class="et">{{ etiqueta }}</p>
    <strong aria-live="polite">{{ mostrado }}</strong>
    <small v-if="detalle" :class="{ punto: hover != null }">{{ detalle }}</small>

    <div v-if="serie" ref="caja" class="tendencia">
      <svg v-if="g" ref="svg" :width="g.W" :height="g.H" aria-hidden="true" @pointermove="mover" @pointerleave="hover = null">
        <template v-if="forma === 'linea'">
          <defs v-if="degrade">
            <linearGradient :id="`${id}-l`" gradientUnits="userSpaceOnUse" x1="0" x2="0" :y1="g.yMax" :y2="g.yMin">
              <stop offset="0" class="alto" /><stop offset="1" class="bajo" />
            </linearGradient>
            <linearGradient :id="`${id}-a`" gradientUnits="userSpaceOnUse" x1="0" x2="0" :y1="g.yMax" :y2="g.H">
              <stop offset="0" class="alto" stop-opacity=".28" /><stop offset="1" class="alto" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="g.area" class="area" :style="degrade ? { fill: `url(#${id}-a)` } : null" />
          <path :d="g.linea" class="linea" :style="degrade ? { stroke: `url(#${id}-l)` } : null" />
          <template v-if="hover != null">
            <line class="guia" :x1="g.px(hover)" :x2="g.px(hover)" :y1="0" :y2="g.H" />
            <circle class="marca" :cx="g.px(hover)" :cy="g.py(g.vals[hover])" r="3.5" />
          </template>
        </template>
        <template v-else>
          <rect v-for="(b, i) in g.barras" :key="i" class="barra" :class="{ apagada: hover != null && hover !== i }"
                :x="b.x" :y="b.y" :width="b.w" :height="b.h + 3" rx="2" :style="degrade ? { fill: tinte(b.t) } : null" />
        </template>
      </svg>
    </div>

    <div v-else-if="comp" class="pie">
      <ul class="leyenda">
        <li v-for="(p, i) in comp" :key="p.nombre" :class="{ apagada: hover != null && hover !== i }">
          <i :style="{ background: p.color }"></i>{{ p.nombre }} <b>{{ formatoPorcentaje(Math.round(p.pct)) }}</b>
        </li>
      </ul>
      <div class="pila" aria-hidden="true" @pointerleave="hover = null">
        <span v-for="(p, i) in comp" :key="p.nombre" :class="{ apagada: hover != null && hover !== i }"
              :style="{ width: `${p.pct}%`, background: p.color }" @pointerenter="hover = i"></span>
      </div>
    </div>

    <div v-else-if="tope" class="pie">
      <p class="estado" :class="tope.estado"><i></i>{{ tope.texto }} <b>{{ formatoPorcentaje(Math.round(tope.pct)) }} de {{ formato(limite) }}</b></p>
      <div class="riel" :class="[tope.estado, { degrade }]" role="meter" :aria-valuenow="usado" aria-valuemin="0" :aria-valuemax="limite" :aria-label="etiqueta">
        <span :style="{ width: `${tope.ancho}%` }"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.indicador { --c: var(--sub); --pad-x: 14px; --pad-y: 12px; display: flex; flex-direction: column; gap: 4px; padding: var(--pad-y) var(--pad-x); background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); min-width: 0; overflow: hidden; }
.indicador.ok { --c: var(--ok); } .indicador.aviso { --c: var(--aviso); } .indicador.error { --c: var(--error); }
.et { margin: 0; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
strong { font: 700 1.35rem var(--mono); letter-spacing: -.01em; font-variant-numeric: tabular-nums; }
small { font-size: .76rem; color: color-mix(in srgb, var(--c) 75%, var(--txt)); }
small.punto { color: var(--sub); }

/* Línea y barras llenan el resto de la tarjeta: hasta los bordes y hasta abajo. */
.tendencia { position: relative; flex: 1 0 56px; margin: 6px calc(-1 * var(--pad-x)) calc(-1 * var(--pad-y)); }
.tendencia svg { position: absolute; inset: 0; display: block; touch-action: pan-y; }
.alto { stop-color: var(--serie-1); }
.bajo { stop-color: color-mix(in srgb, var(--serie-1) 30%, var(--tenue)); }
.area { fill: color-mix(in srgb, var(--serie-1) 16%, transparent); }
.linea { fill: none; stroke: var(--serie-1); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.guia { stroke: var(--borde-fuerte); stroke-dasharray: 2 3; }
.marca { fill: var(--serie-1); stroke: var(--panel); stroke-width: 2; }
.barra { fill: var(--serie-1); transition: opacity .12s; }

/* Composición y tope: leyenda arriba y la barra a sangre contra el borde inferior. */
.pie { display: grid; gap: 10px; margin: auto calc(-1 * var(--pad-x)) calc(-1 * var(--pad-y)); padding-top: 10px; }
.leyenda { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 0; padding: 0 var(--pad-x); list-style: none; font-size: .74rem; color: var(--sub); }
.leyenda li { display: inline-flex; align-items: center; gap: 6px; transition: opacity .12s; }
.leyenda i { width: 8px; height: 8px; border-radius: 2px; }
.leyenda b, .estado b { font: 600 .72rem var(--mono); color: var(--txt); }
.pila { display: flex; height: 12px; gap: 2px; }
.pila span { min-width: 2px; transition: opacity .12s; }
.apagada { opacity: .35; }
.estado { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; padding: 0 var(--pad-x); font-size: .74rem; color: var(--sub); }
.estado i { width: 8px; height: 8px; border-radius: 50%; background: var(--serie-1); }
.estado.aviso i { background: var(--aviso); } .estado.error i { background: var(--error); }
.estado b { margin-left: auto; }
.riel { --r: var(--serie-1); height: 12px; background: var(--trama); }
.riel.aviso { --r: var(--aviso); } .riel.error { --r: var(--error); }
.riel span { display: block; height: 100%; background: var(--r); }
.riel.degrade span { background: linear-gradient(90deg, color-mix(in srgb, var(--r) 30%, var(--tenue)), var(--r)); }
@media (prefers-reduced-motion: reduce) { .barra, .leyenda li, .pila span { transition: none; } }
</style>
