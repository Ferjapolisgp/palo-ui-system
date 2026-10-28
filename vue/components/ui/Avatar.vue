<script setup>
import { computed } from 'vue';
import { iniciales } from '../../lib/formato.js';

// Iniciales en círculo; sin persona asignada, círculo punteado con «?».
const props = defineProps({ nombre: String, tam: { type: Number, default: 22 } });
const letras = computed(() => (props.nombre ? iniciales(props.nombre) : '?'));
</script>

<template>
  <span class="avatar" :class="{ vacio: !nombre }" :style="{ '--t': tam + 'px' }" :title="nombre || 'Sin asignar'">{{ letras }}</span>
</template>

<style scoped>
.avatar { width: var(--t); height: var(--t); border-radius: 50%; display: inline-grid; place-items: center; flex: none; background: var(--grafito); color: #fff; font: 700 calc(var(--t) * .45) var(--mono); }
.avatar.vacio { background: none; border: 1.5px dashed var(--borde-fuerte); color: var(--tenue); }
</style>
