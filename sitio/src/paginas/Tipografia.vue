<script setup>
import { computed, ref } from 'vue';
import Codigo from '../componentes/Codigo.vue';

// Las tres fuentes que trae la librería en fonts/. Si se cambia un archivo, se cambia acá y en fonts/LICENCIAS.md.
const FUENTES = [
  { id: 'ui', familia: 'Geist', token: '--ui', archivo: 'geist-latin-wght.woff2', kb: 29, peso: '100–900', ancho: '—', uso: 'Toda la interfaz: texto, botones, títulos, tablas.', muestra: 'La solicitud TK-1042 vence hoy a las 18:00.' },
  { id: 'mono', familia: 'Geist Mono', token: '--mono', archivo: 'geist-mono-latin-wght.woff2', kb: 23, peso: '100–900', ancho: '—', uso: 'Códigos, series, etiquetas de sección, cabeceras de tabla y cifras a comparar.', muestra: 'TK-1042 · SERIE 01 · 1.284' },
  { id: 'display', familia: 'Archivo', token: '--display', archivo: 'archivo-latin-wdth.woff2', kb: 90, peso: '100–900', ancho: '62–125 %', uso: 'Solo calcas: el logo y títulos estampados (clase .calca). Nunca texto corrido ni datos.', muestra: 'Marcado técnico' },
];
const elegida = ref('ui');
const fuente = computed(() => FUENTES.find((f) => f.id === elegida.value));
const peso = ref(500);
const ancho = ref(125);
const texto = ref('');
const CARACTERES = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ abcdefghijklmnñopqrstuvwxyz 0123456789 áéíóúü ÁÉÍÓÚÜ ¿? ¡! «» “” $ % € · – — … ↑ ↓';
const estilo = computed(() => ({ fontFamily: `var(${fuente.value.token})`, fontWeight: peso.value, fontStretch: fuente.value.id === 'display' ? `${ancho.value}%` : undefined }));

const CARGA = `/* css/tokens.css: ya viene incluido en palo-ui-system.css */
@font-face { font-family: "Geist"; font-weight: 100 900; font-display: swap;
  src: url("../fonts/geist-latin-wght.woff2") format("woff2"); }
@font-face { font-family: "Geist Mono"; font-weight: 100 900; font-display: swap;
  src: url("../fonts/geist-mono-latin-wght.woff2") format("woff2"); }
@font-face { font-family: "Archivo"; font-weight: 100 900; font-stretch: 62% 125%; font-display: swap;
  src: url("../fonts/archivo-latin-wdth.woff2") format("woff2"); }

--ui: "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
--mono: "Geist Mono", ui-monospace, Consolas, monospace;
--display: "Archivo", "Geist", system-ui, sans-serif;`;
const USO = `/* En un componente: siempre el token, nunca el nombre de la fuente */
.codigo { font: 700 .78rem var(--mono); letter-spacing: .06em; text-transform: uppercase; }
.cifra  { font-variant-numeric: tabular-nums; }

<!-- Calca: logo y títulos estampados -->
<h1 class="calca">Palo Docs</h1>`;
</script>

<template>
  <article class="doc">
    <p class="miga">Fundamentos</p>
    <h1>Tipografía</h1>
    <p class="lead">Geist para la interfaz, Geist Mono para todo lo que es un código, una etiqueta o un número a comparar, y Archivo ancho solo para las calcas. Las tres vienen en la carpeta fonts/ de la librería.</p>

    <section>
      <h2 id="fuentes">Fuentes cargadas</h2>
      <p>Variables (un archivo por familia cubre todos los pesos), subconjunto latino y alojadas en la librería: no se piden a ningún servidor externo. El navegador baja cada una solo cuando una pantalla la usa.</p>
      <div class="tabla-simple">
        <table>
          <thead><tr><th>Familia</th><th>Token</th><th>Archivo</th><th>Peso</th><th>Ancho</th><th class="num">Tamaño</th><th>Para qué</th></tr></thead>
          <tbody>
            <tr v-for="f in FUENTES" :key="f.id">
              <td><span :style="{ fontFamily: `var(${f.token})`, fontWeight: 700, fontStretch: f.id === 'display' ? '125%' : undefined }">{{ f.familia }}</span></td>
              <td><code>{{ f.token }}</code></td>
              <td class="mono">{{ f.archivo }}</td>
              <td class="mono">{{ f.peso }}</td>
              <td class="mono">{{ f.ancho }}</td>
              <td class="num">{{ f.kb }} KB</td>
              <td class="sub">{{ f.uso }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="sub">Licencia: SIL Open Font License 1.1 las tres (uso libre, también comercial). Origen y detalle en <code>fonts/LICENCIAS.md</code>.</p>
    </section>

    <section>
      <h2 id="muestrario">Muestrario</h2>
      <div class="muestrario">
        <div class="controles">
          <div class="segmentos" role="radiogroup" aria-label="Fuente">
            <button v-for="f in FUENTES" :key="f.id" type="button" role="radio" :aria-checked="elegida === f.id" :class="{ on: elegida === f.id }" @click="elegida = f.id">{{ f.familia }}</button>
          </div>
          <label class="rango">Peso <input v-model.number="peso" type="range" min="100" max="900" step="100"><b>{{ peso }}</b></label>
          <label class="rango" :class="{ apagado: fuente.id !== 'display' }">Ancho <input v-model.number="ancho" type="range" min="62" max="125" :disabled="fuente.id !== 'display'"><b>{{ fuente.id === 'display' ? `${ancho} %` : '—' }}</b></label>
        </div>
        <input v-model="texto" class="propio" :placeholder="`Escribí para probar · ${fuente.muestra}`" aria-label="Texto de prueba">
        <p class="grande" :class="{ mayus: fuente.id === 'display' }" :style="estilo">{{ texto || fuente.muestra }}</p>
        <p class="juego" :style="estilo">{{ CARACTERES }}</p>
      </div>
      <p class="sub">El subconjunto latino cubre el español entero. No trae ▲ ▼ → ni emojis: esos signos salen de la fuente del sistema, así que en variaciones conviene usarlos con moderación.</p>
    </section>

    <section>
      <h2 id="carga">Cómo se cargan</h2>
      <p>No hay que hacer nada aparte: <code>palo-ui-system/css</code> ya declara las tres. La carpeta <code>fonts/</code> tiene que quedar junto a <code>css/</code>, porque las direcciones son relativas.</p>
      <Codigo suelto :codigo="CARGA" />
      <Codigo suelto :codigo="USO" />
    </section>

    <section>
      <h2 id="uso">Cuándo usar cada una</h2>
      <div class="sino">
        <div><span class="tag ok">Sí</span><span class="calca" style="font-size: 1.3rem">Palo Docs</span><p class="sub">Calca para el nombre de la herramienta o el título de una portada.</p></div>
        <div><span class="tag error">No</span><span class="calca" style="font-size: .9rem">La solicitud vence hoy a las 18:00</span><p class="sub">Calca en texto corrido o en datos: se lee mal y grita.</p></div>
        <div><span class="tag ok">Sí</span><span style="font: 700 .9rem var(--mono); letter-spacing: .06em">TK-1042</span><p class="sub">Mono para lo que se copia, se busca o se compara.</p></div>
        <div><span class="tag error">No</span><span style="font: 500 .9rem var(--mono)">Revisá los documentos antes de enviarlos a firmar.</span><p class="sub">Mono en frases: es para códigos y cifras, no para leer.</p></div>
      </div>
    </section>

    <section>
      <h2 id="escala">Escala</h2>
      <div class="tipos">
        <div><small>Calca<br>Archivo 800 · ancho 125 % · mayúsculas</small><span class="calca" style="font-size: 1.6rem">Marcado técnico</span></div>
        <div><small>Título de página<br>Geist 700 · 1,15 rem</small><span class="titulo-pagina">Solicitudes</span></div>
        <div><small>Texto de interfaz<br>Geist 400 · 14 px · números tabulares</small><span>La solicitud TK-1042 vence hoy a las 18:00; lleva 26 h abierta.</span></div>
        <div><small>Etiqueta de sección<br>Mono 600 · 0,66 rem · mayúsculas</small><span class="etiqueta-seccion">Solicitudes vencidas</span></div>
        <div><small>Código<br>Mono 700 · 0,78 rem</small><span style="font: 700 .78rem var(--mono)">TK-1042</span></div>
        <div><small>Indicador<br>Mono 700 · 1,35 rem</small><span style="font: 700 1.35rem var(--mono)">1.284</span></div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.mono { font: 500 .78rem var(--mono); white-space: nowrap; }
.num { text-align: right !important; font: 500 .8rem var(--mono); white-space: nowrap; }
td.sub { min-width: 220px; }
.muestrario { display: grid; gap: 14px; padding: 18px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.controles { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 22px; }
.segmentos { display: inline-flex; padding: 2px; border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); background: var(--bg); }
.segmentos button { height: 28px; padding: 0 12px; border: 0; background: none; color: var(--sub); font-size: .82rem; }
.segmentos button.on { background: var(--panel-2); color: var(--txt); font-weight: 600; }
.rango { display: inline-flex; align-items: center; gap: 10px; margin: 0; font-size: .82rem; }
.rango input { width: 140px; accent-color: var(--senal); }
.rango b { min-width: 48px; font: 600 .78rem var(--mono); }
.rango.apagado { color: var(--tenue); }
.propio { max-width: 520px; }
.grande { margin: 0; font-size: clamp(1.6rem, 4vw, 2.6rem); line-height: 1.15; overflow-wrap: anywhere; }
.grande.mayus { text-transform: uppercase; }
.juego { margin: 0; color: var(--sub); font-size: 1.05rem; line-height: 1.7; overflow-wrap: anywhere; }
</style>
