<script setup>
import { ref } from 'vue';
import { CurrencyInput, Field } from 'palo-ui-system';

const monto = ref(18450);
</script>

<template>
  <div class="montos">
    <Field etiqueta="Monto del cobro"><CurrencyInput v-model="monto" /></Field>
    <p class="valor">La app recibe <code>{{ monto === null ? 'null' : monto }}</code></p>
  </div>
</template>

<style scoped>
.montos { display: grid; grid-template-columns: minmax(0, 260px) auto; align-items: end; gap: 12px 24px; }
.valor { margin: 0 0 9px; color: var(--sub); font-size: .86rem; }
@media (max-width: 520px) { .montos { grid-template-columns: minmax(0, 1fr); } .valor { margin: 0; } }
</style>
