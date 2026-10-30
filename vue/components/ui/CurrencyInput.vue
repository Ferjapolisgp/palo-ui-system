<script setup>
import { ref, watch } from 'vue';
import { interpretarMonto } from '../../lib/montos.js';

// Monto en pesos: se escribe y se lee en formato es-AR (1.234,56) y emite un número (1234.56), o null si está vacío.
// Mientras se escribe no se reformatea (el cursor no salta); al salir del campo queda con separadores.
// Se puede pegar un monto en cualquier formato: «$ 1.234,56», «1234.56», «1,234.56».
const props = defineProps({
  modelValue: { type: Number, default: null },
  moneda: { type: String, default: '$' },
  decimales: { type: Number, default: 2 },
  placeholder: { type: String, default: '0,00' },
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const formatear = (n) => (n === null || n === undefined ? '' : n.toLocaleString('es-AR', { minimumFractionDigits: props.decimales, maximumFractionDigits: props.decimales }));
const texto = ref(formatear(props.modelValue));
const enfocado = ref(false);

function escribir(e) {
  texto.value = e.target.value;
  const n = interpretarMonto(texto.value);
  emit('update:modelValue', n === null ? null : Number(n.toFixed(props.decimales)));
}
function salir() {
  enfocado.value = false;
  texto.value = formatear(props.modelValue);
}
// Si el valor cambia desde afuera (un «Limpiar», un dato que llega), se refleja salvo mientras se escribe.
watch(() => props.modelValue, (n) => { if (!enfocado.value) texto.value = formatear(n); });
</script>

<template>
  <div class="monto caja-control" :class="{ disabled }">
    <span class="moneda" aria-hidden="true">{{ moneda }}</span>
    <input :value="texto" type="text" inputmode="decimal" autocomplete="off" :placeholder="placeholder" :disabled="disabled"
           @input="escribir" @focus="enfocado = true" @blur="salir">
  </div>
</template>

<style scoped>
.monto { display: flex; align-items: center; border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); background: var(--panel-2); }
.monto:focus-within { outline: 2px solid var(--senal); outline-offset: 2px; }
.moneda { padding-left: 10px; font: 600 .84rem var(--mono); color: var(--sub); }
input { flex: 1; min-width: 0; border: 0; background: none; text-align: right; font: 500 .9rem var(--mono); }
input:focus-visible { outline: none; }
.disabled { opacity: .55; }
</style>
