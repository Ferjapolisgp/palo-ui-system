<script setup>
import { computed } from 'vue';
import { ESTADO_CORTO } from '../../lib/visual.js';

// Etiqueta de ancho fijo, tinte de color y una sola palabra. `etiqueta` es el nombre completo (tooltip).
const props = defineProps({ estado: { type: String, required: true }, etiqueta: String });
const corto = computed(() => ESTADO_CORTO[props.estado] ?? props.estado);
</script>

<template>
  <span class="estado-tag" :class="`e-${estado}`" :title="etiqueta || corto">{{ corto }}</span>
</template>

<style scoped>
.estado-tag {
  --c: var(--tenue);
  display: inline-flex; align-items: center; justify-content: center; width: 96px; padding: 2px 0;
  border: 0; border-radius: var(--r-sm); white-space: nowrap;
  background: color-mix(in srgb, var(--c) 16%, transparent);
  font: 600 .72rem/1.3 var(--ui);
  color: color-mix(in srgb, var(--c) 80%, var(--txt));
}
.e-nuevo { --c: var(--info); }
.e-pendiente_aprobacion { --c: var(--aviso); }
.e-aceptado { --c: var(--e-aceptado); }
.e-en_curso { --c: var(--e-curso); }
.e-esperando_info { --c: var(--e-espera); }
.e-resuelto, .e-verificado { --c: var(--ok); }
.e-cerrado { --c: var(--tenue); }
.e-rechazado { --c: var(--error); }
</style>
