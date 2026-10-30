<script setup>
import { computed } from 'vue';

// Lugar de lo que está cargando, con su forma aproximada: así la pantalla no salta cuando llegan los datos.
// Lo anuncia una sola vez a lectores de pantalla («Cargando…»); las formas son decorativas.
const props = defineProps({
  forma: { type: String, default: 'texto' }, // 'texto' | 'fila' | 'tarjeta' | 'grafico' | 'bloque'
  lineas: { type: Number, default: 3 },
  ancho: [Number, String],
  alto: [Number, String],
  etiqueta: { type: String, default: 'Cargando…' },
});
const medida = (v) => (typeof v === 'number' ? `${v}px` : v);
// Anchos que varían un poco: líneas todas iguales se leen como un bloque, no como texto.
const anchos = computed(() => Array.from({ length: props.lineas }, (_, i) => (i === props.lineas - 1 && props.lineas > 1 ? '62%' : ['100%', '94%', '88%'][i % 3])));
const barras = [58, 82, 40, 70, 96, 64, 76];
</script>

<template>
  <div class="esqueleto" :class="forma" role="status" :style="{ width: medida(ancho), height: medida(alto) }">
    <span class="oculto">{{ etiqueta }}</span>
    <template v-if="forma === 'texto'"><i v-for="(a, i) in anchos" :key="i" class="linea" :style="{ width: a }" aria-hidden="true"></i></template>
    <template v-else-if="forma === 'fila'">
      <i class="linea corta" aria-hidden="true"></i><i class="linea" aria-hidden="true"></i><i class="linea media" aria-hidden="true"></i><i class="pastilla" aria-hidden="true"></i>
    </template>
    <template v-else-if="forma === 'tarjeta'">
      <i class="linea titulo" aria-hidden="true"></i>
      <i v-for="(a, i) in anchos" :key="i" class="linea" :style="{ width: a }" aria-hidden="true"></i>
    </template>
    <div v-else-if="forma === 'grafico'" class="barras" aria-hidden="true"><i v-for="(h, i) in barras" :key="i" :style="{ height: h + '%' }"></i></div>
    <i v-else class="bloque" aria-hidden="true"></i>
  </div>
</template>

<style scoped>
.esqueleto { display: grid; gap: 10px; align-content: start; }
i { display: block; border-radius: var(--r-sm); background: linear-gradient(90deg, var(--panel-2) 0%, var(--borde) 50%, var(--panel-2) 100%) 0 0 / 300% 100%; animation: brillo 1.4s ease-in-out infinite; }
.linea { height: 12px; }
.corta { width: 70px; }
.media { width: 60%; }
.titulo { width: 45%; height: 16px; margin-bottom: 4px; }
.pastilla { width: 76px; height: 18px; }
.fila { grid-template-columns: 70px minmax(0, 1fr) minmax(0, .6fr) 76px; align-items: center; gap: 16px; }
.fila .linea { width: auto; }
.tarjeta { padding: 16px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.grafico { display: flex; height: 180px; }
.barras { flex: 1; display: flex; align-items: flex-end; gap: 10px; padding-bottom: 1px; border-bottom: 1px solid var(--borde); }
.barras i { flex: 1; border-radius: var(--r-sm) var(--r-sm) 0 0; }
.bloque { width: 100%; height: 100%; min-height: 48px; }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@keyframes brillo { from { background-position: 100% 0; } to { background-position: 0 0; } }
@media (prefers-reduced-motion: reduce) { i { animation: none; background: var(--panel-2); } }
</style>
