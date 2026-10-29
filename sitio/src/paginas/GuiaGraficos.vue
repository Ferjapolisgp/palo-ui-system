<script setup>
import { RouterLink } from 'vue-router';
import Codigo from '../componentes/Codigo.vue';
import { usarTokens } from '../usarModo.js';

const t = usarTokens(['serie-1', 'serie-2', 'serie-3', 'serie-4']);
const PREGUNTAS = [
  ['¿Cómo viene un valor en el tiempo?', 'grafico-linea', 'Línea en el tiempo'],
  ['¿Cuánto hay de cada cosa?', 'grafico-barras', 'Barras'],
  ['¿De qué se compone un total?', 'grafico-composicion', 'Composición'],
  ['¿Qué perfil tiene algo frente a su referencia?', 'grafico-radar', 'Radar de perfil'],
  ['¿Cuán cerca está de su límite?', 'grafico-tope', 'Barra de tope'],
  ['Un número clave y hacia dónde va', 'indicador', 'Indicador con tendencia'],
];
</script>

<template>
  <article class="doc">
    <p class="miga">Gráficos</p>
    <h1>Guía de gráficos</h1>
    <p class="lead">Seis formas cubren casi todo lo que necesita un backoffice. Se eligen por la pregunta que responden, no por cómo se ven.</p>

    <section>
      <h2 id="elegir">Qué gráfico usar</h2>
      <div class="tabla-simple">
        <table style="min-width: 420px">
          <thead><tr><th>Pregunta</th><th>Gráfico</th></tr></thead>
          <tbody><tr v-for="[q, id, n] in PREGUNTAS" :key="id"><td><b>{{ q }}</b></td><td><RouterLink :to="`/componentes/${id}`">{{ n }}</RouterLink></td></tr></tbody>
        </table>
      </div>
      <p class="sub">Si la respuesta es un solo número, no hace falta un gráfico: alcanza con el indicador.</p>
    </section>

    <section>
      <h2 id="paleta">Paleta de series</h2>
      <p>Cuatro colores en orden fijo: la primera serie siempre es la 1, la segunda la 2. Validada para daltonismo en oscuro y en claro (separación de al menos 8,4 entre colores vecinos). No incluye el violeta de la señal: ese color es de la interfaz.</p>
      <div class="swatches">
        <div v-for="i in 4" :key="i" class="sw"><i :style="{ background: `var(--serie-${i})` }"></i><span><b>--serie-{{ i }}</b><br>{{ t[`serie-${i}`] }}</span></div>
      </div>
      <p class="sub">En tema claro, las series 3 y 4 tienen menos de 3:1 de contraste con el fondo. Por eso todos los gráficos traen «Ver tabla» con los mismos datos.</p>
      <Codigo suelto codigo="/* css/tokens.css · oscuro */
--serie-1: #3987e5; --serie-2: #d95926; --serie-3: #199e70; --serie-4: #c98500;
/* claro */
--serie-1: #2a78d6; --serie-2: #eb6834; --serie-3: #1baf7a; --serie-4: #eda100;" />
    </section>

    <section>
      <h2 id="reglas">Reglas</h2>
      <div class="regla"><h3>1. Estados con sus colores, series con los suyos</h3><p class="sub">Al día, aviso y error usan <code>--ok</code>, <code>--aviso</code> y <code>--error</code>, siempre con texto. Una serie nunca usa un color de estado ni la señal.</p></div>
      <div class="regla"><h3>2. Un solo eje vertical</h3><p class="sub">Dos medidas de distinta escala van en dos gráficos, nunca en uno con dos ejes.</p></div>
      <div class="regla"><h3>3. El color sigue a la entidad</h3><p class="sub">«Web» es la serie 1 en todos los gráficos. Si un filtro saca una serie, las demás no cambian de color. Más de 4 partes se agrupan en «Otros».</p></div>
      <div class="regla"><h3>4. Texto en colores de texto</h3><p class="sub">Valores, ejes y leyendas usan <code>--txt</code> y <code>--sub</code>. El color de la serie va en la marca de al lado, no en las letras.</p></div>
      <div class="regla"><h3>5. Siempre con descripción y tabla</h3><p class="sub">La prop <code>descripcion</code> es obligatoria y cada gráfico ofrece «Ver tabla» con los mismos datos.</p></div>
    </section>
  </article>
</template>
