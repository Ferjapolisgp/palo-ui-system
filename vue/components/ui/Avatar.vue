<script setup>
import { computed } from 'vue';
import { iniciales } from '../../lib/formato.js';
import Icono from './Icono.vue';

// Cuadrado con las iniciales; en tamaño chico (hasta 24 px) solo la primera letra. Sin persona (incógnito),
// cuadrado punteado con el ícono de usuario.
const props = defineProps({ nombre: String, tam: { type: Number, default: 22 } });
const letras = computed(() => {
  const i = iniciales(props.nombre || '');
  return props.tam <= 24 ? i.slice(0, 1) : i;
});
</script>

<template>
  <span class="avatar" :class="{ vacio: !nombre }" :style="{ '--t': tam + 'px' }" :title="nombre || 'Sin asignar'">
    <Icono v-if="!nombre" nombre="usuario" :tam="Math.round(tam * .6)" aria-hidden="true" />
    <template v-else>{{ letras }}</template>
  </span>
</template>

<style scoped>
.avatar { width: var(--t); height: var(--t); border-radius: 0; display: inline-grid; place-items: center; flex: none; background: var(--grafito); color: #fff; font: 700 calc(var(--t) * .4) var(--mono); }
.avatar.vacio { background: none; border: 1.5px dashed var(--borde-fuerte); color: var(--tenue); }
</style>
