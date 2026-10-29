<script setup>
import { usarTokens } from '../usarModo.js';

const GRUPOS = [
  ['superficies', 'Superficies y texto', '', [['bg'], ['panel'], ['panel-2'], ['borde'], ['borde-fuerte'], ['txt'], ['sub'], ['tenue']]],
  ['senal', 'Señal', 'Es de la interfaz: acción principal, ítem activo y foco. Nunca pinta datos.', [['senal', 'acción, activo, foco'], ['senal-txt', 'texto sobre señal'], ['grafito', 'avatar']]],
  ['semantica', 'Estados', 'Para el estado de los datos. Siempre acompañados de texto o forma.', [['ok', 'al día, acreditado'], ['aviso', 'por vencer, revisar'], ['error', 'deuda, rechazado'], ['info', 'novedad, enlace']]],
  ['series', 'Series de gráficos', 'Orden fijo, validado para daltonismo. Detalle en la guía de gráficos.', [['serie-1'], ['serie-2'], ['serie-3'], ['serie-4']]],
];
const t = usarTokens(GRUPOS.flatMap((g) => g[3].map((x) => x[0])));
</script>

<template>
  <article class="doc">
    <p class="miga">Fundamentos</p>
    <h1>Color</h1>
    <p class="lead">Valores del tema actual. Los componentes usan solo estos nombres, nunca un valor escrito a mano. Cambiá el tema arriba a la derecha y los valores se actualizan.</p>
    <section v-for="[id, titulo, texto, tokens] in GRUPOS" :key="id">
      <h2 :id="id">{{ titulo }}</h2>
      <p v-if="texto">{{ texto }}</p>
      <div class="swatches">
        <div v-for="[n, nota] in tokens" :key="n" class="sw"><i :style="{ background: `var(--${n})` }"></i><span><b>--{{ n }}</b><br>{{ t[n] }}<template v-if="nota"><br>{{ nota }}</template></span></div>
      </div>
    </section>
  </article>
</template>
