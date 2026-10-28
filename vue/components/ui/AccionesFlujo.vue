<script setup>
import { computed } from 'vue';
import { acciones, ESTADOS_FINALES } from '../../lib/flujo.js';

// Botones del paso siguiente del ticket. Solo existen los pasos que el flujo permite desde el estado actual;
// los que la persona no puede dar ahora se ven deshabilitados y con el motivo escrito debajo.
// Emite `elegir` con la acción (destino, nota que pide, si pide confirmación).
const props = defineProps({
  ticket: { type: Object, required: true },
  yo: Object,
  campos: { type: Array, default: () => [] },
  bloqueado: Boolean, // guardando o solo lectura
});
const emit = defineEmits(['elegir']);

const lista = computed(() => acciones(props.ticket, props.yo, props.campos));
const motivos = computed(() => lista.value.filter((a) => !a.ok).map((a) => `${a.texto}: ${a.motivo}`));
const final = computed(() => ESTADOS_FINALES.includes(props.ticket.estado));
const enAprobacion = computed(() => props.ticket.estado === 'pendiente_aprobacion');
</script>

<template>
  <section class="flujo" aria-label="Paso siguiente">
    <p class="rotulo">Paso siguiente</p>
    <div v-if="lista.length" class="botones">
      <button v-for="a in lista" :key="a.destino" type="button" :class="['accion', a.tono]" :disabled="bloqueado || !a.ok"
              :title="a.ok ? undefined : a.motivo" @click="emit('elegir', a)">{{ a.texto }}</button>
    </div>
    <p v-else-if="final" class="nota">Estado final: el ticket no admite más cambios.</p>
    <p v-else-if="enAprobacion" class="nota">Espera una aprobación: se decide en el bloque de aprobación.</p>
    <ul v-if="motivos.length" class="motivos"><li v-for="m in motivos" :key="m">{{ m }}</li></ul>
  </section>
</template>

<style scoped>
.flujo { margin: 0; padding: 0; border: 0; }
.rotulo { margin: 0 0 8px; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.botones { display: flex; flex-wrap: wrap; gap: 8px; }
.accion { padding: 7px 14px; font-weight: 600; }
.accion.principal { background: var(--senal); color: var(--senal-txt); border-color: var(--senal); font-weight: 700; }
.accion.principal:hover:not(:disabled) { filter: brightness(1.06); }
.accion.peligro { color: var(--error); border-color: color-mix(in srgb, var(--error) 45%, var(--borde-fuerte)); }
.accion:disabled { opacity: .45; cursor: not-allowed; }
.nota { margin: 0; color: var(--sub); }
.motivos { margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 2px; font-size: .78rem; color: var(--sub); }
</style>
