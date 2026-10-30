<script setup>
import Icono from './Icono.vue';

// Estado vacío: qué falta y cómo seguir, en lugar de una tabla en blanco. El slot lleva una sola acción.
defineProps({ titulo: { type: String, required: true }, texto: String, icono: { type: String, default: 'buscar' } });
</script>

<template>
  <div class="vacio">
    <span class="marco"><Icono :nombre="icono" /></span>
    <b>{{ titulo }}</b>
    <p v-if="texto">{{ texto }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vacio { display: grid; justify-items: center; gap: 8px; padding: 24px 16px; text-align: center; }
.marco { width: 44px; height: 44px; display: grid; place-items: center; border: 1.5px dashed var(--borde-fuerte); border-radius: var(--r-md); color: var(--sub); }
b { font-size: .95rem; }
p { margin: 0; max-width: 36ch; color: var(--sub); font-size: .84rem; }
</style>
