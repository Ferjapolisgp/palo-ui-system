<script setup>
import { computed } from 'vue';

// Bloque de código con un resaltado mínimo: etiquetas, textos entre comillas y comentarios.
const props = defineProps({ codigo: { type: String, required: true }, suelto: Boolean });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = computed(() => esc(props.codigo.trim())
  .replace(/("[^"\n]*"|'[^'\n]*')/g, '<span class="c-s">$1</span>')
  .replace(/(&lt;\/?)([A-Za-z][\w-]*)/g, '$1<span class="c-t">$2</span>')
  .replace(/(\/\/[^\n]*|&lt;!--[\s\S]*?--&gt;)/g, '<span class="c-c">$1</span>'));
</script>

<template>
  <pre :class="{ bloque: suelto }"><code v-html="html"></code></pre>
</template>
