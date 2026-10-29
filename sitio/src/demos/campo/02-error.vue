<script setup>
import { computed, ref } from 'vue';

const cuit = ref('27-2890123-6');
const error = computed(() => (cuit.value.replace(/\D/g, '').length === 11 ? '' : 'Faltan dígitos: el CUIT tiene 11.'));
</script>

<template>
  <div class="campo">
    <label for="cuit">CUIT</label>
    <input id="cuit" v-model="cuit" :aria-invalid="!!error" :class="{ invalido: error }">
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.campo { width: 100%; max-width: 320px; }
.invalido { border-color: var(--error); }
.error { margin: 4px 0 0; font-size: .8rem; }
</style>
