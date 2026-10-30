<script setup>
import { ref } from 'vue';
import { DatePicker, Field, hoyIso } from 'palo-ui-system';

const fecha = ref('2026-10-24');
const error = ref('');
</script>

<template>
  <div class="fecha">
    <Field etiqueta="Fecha del cobro" ayuda="dd/mm/aaaa. No puede ser futura." :error="error">
      <DatePicker v-model="fecha" :max="hoyIso()" @update:model-value="error = ''"
                  @invalida="(e) => (error = e.motivo === 'fuera de los límites' ? 'La fecha no puede ser futura.' : `«${e.texto}» no es una fecha válida.`)" />
    </Field>
    <p class="valor">La app recibe <code>{{ fecha ?? 'null' }}</code></p>
  </div>
</template>

<style scoped>
.fecha { display: grid; grid-template-columns: minmax(0, 240px) auto; align-items: start; gap: 12px 24px; }
.valor { margin: 30px 0 0; color: var(--sub); font-size: .86rem; }
@media (max-width: 520px) { .fecha { grid-template-columns: minmax(0, 1fr); } .valor { margin: 0; } }
</style>
