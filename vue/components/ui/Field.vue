<script setup>
import { computed, onMounted, onUpdated, ref, useId } from 'vue';

// Campo de formulario: etiqueta arriba, ayuda y error debajo, y todo conectado al control para lectores de pantalla
// (id, aria-describedby, aria-invalid, required). El control va en el slot tal cual: Field lo encuentra y lo conecta.
// No valida: el error llega por la prop, así sirve con cualquier forma de validar.
const props = defineProps({
  etiqueta: { type: String, required: true },
  ayuda: String,
  error: String,
  obligatorio: Boolean,
});
const id = useId();
const raiz = ref(null);
const paraLabel = ref(`${id}-c`);
const describe = computed(() => [props.error && `${id}-e`, props.ayuda && `${id}-a`].filter(Boolean).join(' ') || null);

// Conecta el primer control del slot. Si ya trae id se respeta; si no, se le pone uno. Se repite en cada
// actualización por si el control se vuelve a crear (un v-if, un cambio de tipo).
function conectar() {
  const control = raiz.value?.querySelector('input:not([type="hidden"]), select, textarea');
  if (!control) return;
  if (!control.id) control.id = `${id}-c`;
  paraLabel.value = control.id;
  const atributos = { 'aria-describedby': describe.value, 'aria-invalid': props.error ? 'true' : null, 'aria-required': props.obligatorio ? 'true' : null };
  Object.entries(atributos).forEach(([k, v]) => (v ? control.setAttribute(k, v) : control.removeAttribute(k)));
}
onMounted(conectar);
onUpdated(conectar);
</script>

<template>
  <div ref="raiz" class="field" :class="{ 'con-error': error }">
    <label :for="paraLabel">{{ etiqueta }}<span v-if="obligatorio" class="obligatorio" aria-hidden="true"> *</span></label>
    <slot />
    <p v-if="ayuda" :id="`${id}-a`" class="field-ayuda">{{ ayuda }}</p>
    <p :id="`${id}-e`" class="field-error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<style scoped>
.field { display: grid; gap: 4px; align-content: start; min-width: 0; }
label { margin: 0; }
.obligatorio { color: var(--error); }
.field-ayuda { margin: 0; font-size: .78rem; color: var(--sub); }
.field-error { margin: 0; font-size: .8rem; color: var(--error); }
.field-error:empty { display: none; }
.con-error :slotted(input), .con-error :slotted(select), .con-error :slotted(textarea), .con-error :slotted(.caja-control) { border-color: var(--error); }
</style>
