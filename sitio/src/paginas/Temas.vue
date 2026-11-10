<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { Icono, Interruptor, Marca, TarjetaProceso, aplicarMarca, contraste, textoSobre, variablesMarca } from 'palo-ui-system';
import Codigo from '../componentes/Codigo.vue';

// Los temas de css/temas.css. Los colores son los de la señal en claro y en oscuro (solo para las muestras).
const TEMAS = [
  { id: '', nombre: 'Palo base', nota: 'Violeta. Es lo que se ve si no se elige nada.', claro: '#6a3df0', oscuro: '#7c4dff' },
  { id: 'naranja', nombre: 'Naranja', nota: 'El que usa Ticketera.', claro: '#c24a06', oscuro: '#ff6a1f' },
  { id: 'amarillo', nombre: 'Amarillo', nota: 'La señal de la primera Ticketera.', claro: '#876400', oscuro: '#f2c230' },
  { id: 'cian', nombre: 'Cian', nota: 'Frío, lejos de los estados.', claro: '#0a7ea4', oscuro: '#22b8e0' },
  { id: 'rosa', nombre: 'Rosa', nota: 'Cerca del tono «en espera»: conviene mirar los gráficos.', claro: '#c4287a', oscuro: '#ff5ea8' },
];
const elegido = ref('');
const claro = ref('#2f6fe0');
const oscuro = ref('#4c8dff');
const tinte = ref(35);
const sitio = ref(false);

const propia = computed(() => elegido.value === 'propia');
const marca = computed(() => ({ senal: [claro.value, oscuro.value], tinte: tinte.value }));
const estilo = computed(() => (propia.value ? variablesMarca(marca.value) : {}));

// AA: 4,5 para el texto sobre la señal y 3 para la señal como borde o ícono sobre el panel.
const REV = computed(() => [
  ['Claro · texto sobre la señal', contraste(claro.value, textoSobre(claro.value)), 4.5],
  ['Claro · señal sobre el panel', contraste(claro.value, '#ffffff'), 3],
  ['Oscuro · texto sobre la señal', contraste(oscuro.value, textoSobre(oscuro.value)), 4.5],
  ['Oscuro · señal sobre el panel', contraste(oscuro.value, '#1b1e24'), 3],
]);

const codigo = computed(() => `aplicarMarca({ senal: ['${claro.value}', '${oscuro.value}']${tinte.value !== 35 ? `, tinte: ${tinte.value}` : ''} });`);
const copiado = ref(false);
async function copiar() {
  try { await navigator.clipboard.writeText(codigo.value); copiado.value = true; setTimeout(() => (copiado.value = false), 1600); } catch { /* sin permiso: queda el texto a la vista */ }
}

function elegir(id) { elegido.value = id; if (sitio.value) aplicarAlSitio(); }
function aplicarAlSitio() { aplicarMarca(propia.value ? marca.value : elegido.value || null); }
function alternarSitio(v) { sitio.value = v; if (v) aplicarAlSitio(); else aplicarMarca(null); }
onBeforeUnmount(() => aplicarMarca(null));

const ICONOS = ['inicio', 'buscar', 'documento', 'calendario', 'campana', 'ajustes'];
const PERILLAS = [
  ['--senal · --senal-txt', 'Acción principal, ítem activo, foco y el texto que va encima. Es la perilla principal.', 'aplicarMarca({ senal })'],
  ['--logo-fondo · --logo-flor', 'El cuadro y la flor del cardón. Son de marca: no se usan en la interfaz.', 'Los presets los traen; el tema propio usa la señal'],
  ['--icono', 'Íconos neutros de menús y listas (los que llevan acento). Un neutro con tinte de marca.', '--tinte'],
  ['--tag', 'Etiquetas sin estado (.tag a secas). Los estados siguen con su color.', '--tinte'],
  ['--detalle', 'Esquinas de encuadre sin tono propio, como las de una tarjeta común.', '--tinte'],
  ['--tinte', 'Cuánto de la marca se mezcla en lo neutro: 0 % deja todo gris, 60 % se nota mucho.', 'tinte: 0–60'],
];
</script>

<template>
  <article class="doc">
    <p class="miga">Fundamentos</p>
    <h1>Temas de marca</h1>
    <p class="lead">Cada herramienta se pinta con su color sin tocar componentes ni copiar CSS: se elige un tema, o se arma uno con dos colores. Funciona en claro y en oscuro. Los estados y los gráficos no cambian: son del dato.</p>

    <section>
      <h2 id="elegir">Elegí un tema</h2>
      <div class="temas" role="radiogroup" aria-label="Tema de marca">
        <button v-for="t in TEMAS" :key="t.id" type="button" class="chip" role="radio" :aria-checked="elegido === t.id" @click="elegir(t.id)">
          <span class="par" aria-hidden="true"><i :style="{ background: t.claro }" /><i :style="{ background: t.oscuro }" /></span>
          <span class="txt"><b>{{ t.nombre }}</b><small>{{ t.nota }}</small></span>
        </button>
        <button type="button" class="chip" role="radio" :aria-checked="propia" @click="elegir('propia')">
          <span class="par" aria-hidden="true"><i :style="{ background: claro }" /><i :style="{ background: oscuro }" /></span>
          <span class="txt"><b>Propio</b><small>Elegí los colores acá abajo.</small></span>
        </button>
      </div>

      <div v-if="propia" class="armar">
        <label>Señal en claro <input v-model="claro" type="color"> <code>{{ claro }}</code></label>
        <label>Señal en oscuro <input v-model="oscuro" type="color"> <code>{{ oscuro }}</code></label>
        <label>Tinte en lo neutro <input v-model.number="tinte" type="range" min="0" max="60" step="5"> <code>{{ tinte }} %</code></label>
        <ul class="rev">
          <li v-for="[txt, valor, minimo] in REV" :key="txt"><span class="tag" :class="valor >= minimo ? 'ok' : 'error'">{{ valor >= minimo ? '✓ Cumple' : '✕ No cumple' }}</span> {{ txt }} <b>{{ valor.toFixed(1) }}</b> <small>(mínimo {{ minimo }})</small></li>
        </ul>
        <div class="copiar"><Codigo suelto :codigo="codigo" /><button type="button" @click="copiar">{{ copiado ? 'Copiado' : 'Copiar' }}</button></div>
      </div>
    </section>

    <section>
      <h2 id="vitrina">Cómo se ve</h2>
      <p class="sub">Cambiá el modo arriba a la derecha para ver el otro lado. Lo de abajo toma el tema elegido; con el interruptor, también el resto del sitio (menú incluido).</p>
      <Interruptor :model-value="sitio" @update:model-value="alternarSitio">Probar en todo el sitio</Interruptor>

      <div class="vit" :data-marca="elegido || undefined" :style="estilo">
        <div class="fila">
          <Marca producto="DOCS" />
          <button type="button" class="primario">Guardar cambios</button>
          <button type="button">Cancelar</button>
        </div>

        <div class="cols">
          <div class="caja">
            <p class="etiqueta-seccion">Íconos de menú</p>
            <ul class="menu">
              <li v-for="(n, i) in ICONOS" :key="n" :class="{ activo: i === 0 }"><Icono :nombre="n" acento /><span>{{ n }}</span></li>
            </ul>
          </div>
          <div class="caja">
            <p class="etiqueta-seccion">Etiquetas</p>
            <div class="tags"><span class="tag">Sin estado</span><span class="tag">Borrador</span><span class="tag ok">Al día</span><span class="tag aviso">Por vencer</span><span class="tag error">Rechazado</span><span class="tag info">Nuevo</span></div>
            <p class="etiqueta-seccion">Detalles</p>
            <div class="enc encuadre">Esquinas de encuadre sin tono</div>
            <Interruptor :model-value="true">Opción encendida</Interruptor>
          </div>
        </div>

        <TarjetaProceso codigo="PR-0412" titulo="Importación de documentos" detalle="Ejemplo" estado="curso" :avance="62" conteo="112 / 180 archivos">
          <template #pie>Hace <b>04:12</b></template>
          <template #acciones><button type="button">Pausar</button></template>
        </TarjetaProceso>
      </div>
    </section>

    <section>
      <h2 id="usar">Cómo se usa</h2>
      <p class="sub">1. Sumá la hoja de temas (ya viene dentro de <code>palo-ui-system/css</code>). 2. Elegí el tema.</p>
      <Codigo suelto codigo="<!-- Fijo, sin JavaScript -->
<html data-marca=&quot;naranja&quot;>" />
      <Codigo suelto codigo="import { aplicarMarca, leerMarca } from 'palo-ui-system';

aplicarMarca('naranja');                         // un tema de la hoja
aplicarMarca({ senal: ['#c24a06', '#ff6a1f'] }); // uno propio: claro y oscuro
aplicarMarca(null);                              // vuelve a la marca base

aplicarMarca(leerMarca());                       // al arrancar: recuerda el tema elegido" />
      <p class="sub">Un tema propio no se recuerda solo: la app guarda su configuración y vuelve a llamar a <code>aplicarMarca()</code>. El texto sobre la señal se elige solo (blanco u oscuro, el que más contraste da).</p>
    </section>

    <section>
      <h2 id="perillas">Qué se puede cambiar</h2>
      <div class="tabla">
        <table>
          <thead><tr><th>Token</th><th>Qué pinta</th><th>Cómo se mueve</th></tr></thead>
          <tbody><tr v-for="[a, b, c] in PERILLAS" :key="a"><td><code>{{ a }}</code></td><td>{{ b }}</td><td>{{ c }}</td></tr></tbody>
        </table>
      </div>
      <p class="sub">Por qué los íconos y las etiquetas no llevan la señal pura: la señal es de la interfaz (acción, activo, foco) y un dato nunca la usa. Lo neutro recibe solo un tinte de la marca.</p>
    </section>
  </article>
</template>

<style scoped>
.sub { color: var(--sub); font-size: .88rem; }
.temas { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); }
.chip { display: flex; align-items: center; gap: 12px; padding: 10px 12px; text-align: left; background: var(--panel); border: 1px solid var(--borde); color: var(--txt); }
.chip[aria-checked="true"] { border-color: var(--txt); background: var(--panel-2); }
.par { display: grid; grid-template-columns: 1fr 1fr; width: 34px; height: 34px; flex: none; border: 1px solid var(--borde-fuerte); }
.par i { display: block; }
.txt { display: grid; gap: 2px; min-width: 0; }
.txt b { font-weight: 600; font-size: .88rem; }
.txt small { color: var(--sub); font-size: .74rem; line-height: 1.3; }
.armar { display: grid; gap: 12px; padding: 14px 16px; background: var(--panel); border: 1px solid var(--borde); }
.armar label { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: .86rem; }
.armar input[type="color"] { width: 44px; height: 30px; padding: 0; border: 1px solid var(--borde-fuerte); background: none; }
.armar code { font: 600 .74rem var(--mono); color: var(--sub); }
.rev { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: .82rem; }
.rev b { font: 600 .8rem var(--mono); }
.rev small { color: var(--tenue); }
.copiar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.copiar > :first-child { flex: 1; min-width: 0; margin: 0; }

.vit { display: grid; gap: 18px; padding: 18px; background: var(--bg); border: 1px solid var(--borde); }
.fila { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.cols { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
.caja { display: grid; gap: 10px; align-content: start; padding: 14px; background: var(--panel); border: 1px solid var(--borde); }
.menu { display: grid; gap: 2px; margin: 0; padding: 0; list-style: none; }
.menu li { display: flex; align-items: center; gap: 10px; padding: 7px 10px; font-size: .86rem; color: var(--sub); text-transform: capitalize; }
.menu li.activo { color: var(--txt); background: color-mix(in srgb, var(--senal) 14%, var(--panel)); box-shadow: inset 2px 0 0 var(--senal); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.enc { position: relative; padding: 12px 14px; font-size: .84rem; color: var(--sub); border: 1px solid var(--borde); }

.tabla { overflow-x: auto; background: var(--panel); border: 1px solid var(--borde); }
.tabla table { width: 100%; min-width: 620px; border-collapse: collapse; }
.tabla th { text-align: left; padding: 8px 12px; font: 600 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); border-bottom: 1px solid var(--borde); }
.tabla td { padding: 9px 12px; border-bottom: 1px solid var(--borde); font-size: .84rem; vertical-align: top; }
.tabla tr:last-child td { border-bottom: 0; }
.tabla code { font: 600 .76rem var(--mono); }
</style>
