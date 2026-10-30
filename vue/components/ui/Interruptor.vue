<script setup>
import { useId } from 'vue';

// Interruptor para opciones que se aplican en el momento, sin botón «Guardar». El slot es el texto de la opción.
// Riel rectangular oscuro; encendido, la perilla se corre y se ilumina con la señal.
const props = defineProps({ modelValue: Boolean, disabled: Boolean });
const emit = defineEmits(['update:modelValue']);
const id = useId();
const cambiar = () => { if (!props.disabled) emit('update:modelValue', !props.modelValue); };
</script>

<template>
  <div class="interruptor" :class="{ disabled }">
    <button type="button" role="switch" :aria-checked="modelValue" :aria-labelledby="id" :disabled="disabled" @click="cambiar"><span></span></button>
    <span :id="id" class="texto" @click="cambiar"><slot /></span>
  </div>
</template>

<style scoped>
.interruptor { display: inline-flex; align-items: center; gap: 10px; font-size: .9rem; }
/* Riel rectangular y oscuro; lo único que se ilumina al encender es la perilla. */
button { position: relative; width: 40px; height: 20px; padding: 0; flex: none; border-radius: var(--r-sm); border: 1px solid var(--borde-fuerte); background: var(--bg); }
button:hover { border-color: var(--sub); background: var(--bg); }
button span { position: absolute; top: 2px; left: 2px; width: 18px; height: 14px; border-radius: var(--r-sm);
  background: var(--tenue); transition: transform .12s, background-color .12s, box-shadow .12s; }
/* Dos marcas de agarre en la perilla, como en una llave de tablero */
button span::before { content: ""; position: absolute; inset: 4px 6px; border-inline: 1px solid color-mix(in srgb, var(--bg) 55%, transparent); }
button[aria-checked="true"] { border-color: color-mix(in srgb, var(--senal) 55%, var(--borde-fuerte)); }
button[aria-checked="true"] span { transform: translateX(18px); background: var(--senal);
  box-shadow: 0 0 6px 1px color-mix(in srgb, var(--senal) 70%, transparent), 0 0 14px color-mix(in srgb, var(--senal) 35%, transparent); }
button[aria-checked="true"] span::before { border-color: color-mix(in srgb, var(--senal-txt) 55%, transparent); }
button:disabled span { box-shadow: none; }
.texto { cursor: pointer; }
.disabled .texto { cursor: default; color: var(--sub); }
@media (prefers-reduced-motion: reduce) { button span { transition: none; } }
</style>
