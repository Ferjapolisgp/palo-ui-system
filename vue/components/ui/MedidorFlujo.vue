<script setup>
import { computed } from 'vue';
import { vencimiento } from '../../lib/formato.js';
import { nivelPlazo, pasoDe, rutaDe, tramos } from '../../lib/visual.js';

// Los tramos son los pasos del flujo del ticket; el color es el plazo (verde, naranja, rojo) y el texto dice cuándo vence.
// El ancho es fijo: con más pasos los tramos se hacen más finos y, pasado el tope, se agrupan.
// La ruta sale del tipo del ticket (con aprobación y/o verificación independiente, como en el diagrama del ciclo de vida);
// `ruta` y `paso` (1 = primero) permiten forzarlos, por ejemplo con más aprobadores.
const props = defineProps({
  ticket: { type: Object, required: true },
  ruta: Array,
  paso: Number,
  sinTexto: Boolean,
});
const rutaTicket = computed(() => props.ruta ?? rutaDe(props.ticket));
const actual = computed(() => props.paso ?? pasoDe(props.ticket, rutaTicket.value));
const t = computed(() => tramos(rutaTicket.value.length, actual.value));
const nivel = computed(() => nivelPlazo(props.ticket));
const texto = computed(() => vencimiento(props.ticket).texto);
const ayuda = computed(() => {
  const ruta = rutaTicket.value, n = ruta.length;
  const agrupado = n > t.value.total ? ` (agrupado en ${t.value.total} tramos)` : '';
  return `Paso ${actual.value} de ${n}: ${ruta[actual.value - 1] ?? '—'}${agrupado}\n${ruta.join(' → ')}`;
});
</script>

<template>
  <span v-if="nivel === 'nada'" class="sin">---</span>
  <span v-else class="medidor" :class="nivel && `tono-${nivel}`" :title="ayuda">
    <span class="tramos"><i v-for="n in t.total" :key="n" :class="{ on: n <= t.llenos }" /></span>
    <span v-if="!sinTexto" class="tx">{{ texto }}</span>
  </span>
</template>

<style scoped>
.medidor { --c: var(--ok); display: inline-flex; align-items: center; gap: 8px; }
.medidor.tono-aviso { --c: var(--aviso); }
.medidor.tono-error { --c: var(--error); }
.tramos { display: inline-flex; gap: 2px; width: 38px; flex: none; }
i { flex: 1; min-width: 0; height: 12px; border-radius: 1px; background: var(--borde-fuerte); }
i.on { background: var(--c); }
.tx { font-size: .75rem; color: var(--sub); white-space: nowrap; }
.tono-aviso .tx, .tono-error .tx { font-weight: 600; }
.tono-aviso .tx { color: var(--aviso); }
.tono-error .tx { color: var(--error); }
.sin { color: var(--tenue); letter-spacing: .1em; }
</style>
