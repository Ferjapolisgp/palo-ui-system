<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

// Código de un solo uso en casillas de un dígito: avanza solo, Borrar retrocede y pegar reparte el código entero.
// El valor es un texto de dígitos seguidos, sin huecos: tocar una casilla más adelante lleva a la primera vacía.
const props = defineProps({
  modelValue: { type: String, default: '' },
  largo: { type: Number, default: 6 },
  etiqueta: { type: String, default: 'Código de verificación' },
  error: Boolean,
  disabled: Boolean,
  autofocus: Boolean,
});
const emit = defineEmits(['update:modelValue', 'completo']);
const casillas = ref([]);
const digitos = computed(() => Array.from({ length: props.largo }, (_, i) => props.modelValue[i] ?? ''));

function enfocar(i) {
  const el = casillas.value[Math.max(0, Math.min(i, props.largo - 1))];
  el?.focus();
  el?.select();
}

function fijar(valor, foco) {
  const limpio = valor.replace(/\D/g, '').slice(0, props.largo);
  emit('update:modelValue', limpio);
  if (limpio.length === props.largo && limpio !== props.modelValue) emit('completo', limpio);
  // Después de que el padre actualice el valor: si no, alEnfocar ve el largo viejo y devuelve el foco.
  nextTick(() => enfocar(foco ?? limpio.length));
}

function escribir(i, e) {
  const v = e.target.value.replace(/\D/g, '');
  const actual = props.modelValue;
  // Varios dígitos de una vez: pegado o autocompletado del sistema («one-time-code»).
  const nuevo = v.length > 1 ? actual.slice(0, i) + v : actual.slice(0, i) + v.slice(-1) + actual.slice(i + 1);
  e.target.value = nuevo[i] ?? '';
  if (!v) return;
  fijar(nuevo, v.length > 1 ? undefined : i + 1);
}

function tecla(i, e) {
  const actual = props.modelValue;
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (actual[i]) fijar(actual.slice(0, i) + actual.slice(i + 1), i);
    else if (i > 0) fijar(actual.slice(0, i - 1) + actual.slice(i), i - 1);
  } else if (e.key === 'ArrowLeft') { e.preventDefault(); enfocar(i - 1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); enfocar(Math.min(i + 1, actual.length)); }
}

function alEnfocar(i) {
  if (i > props.modelValue.length) enfocar(props.modelValue.length);
  else casillas.value[i]?.select();
}

onMounted(() => { if (props.autofocus) enfocar(props.modelValue.length); });

// Deshabilitar saca el foco; al habilitarse otra vez (por ejemplo tras un error) vuelve, para corregir sin el mouse.
let teniaFoco = false;
watch(() => props.disabled, (deshabilitado) => {
  if (deshabilitado) teniaFoco = casillas.value.includes(document.activeElement);
  else if (teniaFoco) nextTick(() => enfocar(Math.min(props.modelValue.length, props.largo - 1)));
}, { flush: 'pre' });
defineExpose({ enfocar });
</script>

<template>
  <div class="codigo" :class="{ error }" role="group" :aria-label="etiqueta" :style="{ '--largo': largo }">
    <input v-for="(d, i) in digitos" :key="i" :ref="(el) => (casillas[i] = el)" :value="d" type="text"
           inputmode="numeric" pattern="[0-9]*" placeholder="0" :autocomplete="i === 0 ? 'one-time-code' : 'off'"
           :aria-label="`Dígito ${i + 1} de ${largo}`" :aria-invalid="error || undefined" :disabled="disabled"
           @input="escribir(i, $event)" @keydown="tecla(i, $event)" @focus="alEnfocar(i)">
  </div>
</template>

<style scoped>
.codigo { display: grid; grid-template-columns: repeat(var(--largo), minmax(0, 1fr)); gap: 10px; }
input { height: 56px; padding: 0; text-align: center; font: 600 1.45rem var(--mono); background: var(--panel-2); caret-color: var(--senal); }
input::placeholder { color: var(--tenue); opacity: 1; }
input:focus { outline: none; border-color: var(--senal); box-shadow: 0 0 0 3px color-mix(in srgb, var(--senal) 28%, transparent); }
input:focus::placeholder { color: transparent; }
.error input { border-color: var(--error); }
.error input:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--error) 25%, transparent); }
input:disabled { opacity: .55; }
@media (max-width: 420px) { .codigo { gap: 6px; } input { height: 48px; font-size: 1.2rem; } }
</style>
