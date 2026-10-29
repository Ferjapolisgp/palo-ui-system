<script setup>
import { useId } from 'vue';

// Interruptor para opciones que se aplican en el momento, sin botón «Guardar». El slot es el texto de la opción.
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
button { position: relative; width: 36px; height: 20px; padding: 0; flex: none; border-radius: 99px; border: 1px solid var(--borde-fuerte); background: var(--panel-2); }
button span { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--sub); transition: transform .15s; }
button[aria-checked="true"] { background: var(--senal); border-color: var(--senal); }
button[aria-checked="true"] span { transform: translateX(16px); background: var(--senal-txt); }
.texto { cursor: pointer; }
.disabled .texto { cursor: default; color: var(--sub); }
@media (prefers-reduced-motion: reduce) { button span { transition: none; } }
</style>
