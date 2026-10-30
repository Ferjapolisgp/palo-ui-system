<script setup>
import { computed } from 'vue';

// Cupos usados y libres, un cuadrado por cupo (máquinas, cajas, lugares). Para pocos cupos contables:
// más de 64 se leen mejor con una BarraUso.
const props = defineProps({
  usados: { type: Number, required: true },
  total: { type: Number, required: true },
  columnas: { type: Number, default: 8 },
  etiqueta: { type: String, default: 'Cupos' },
});
const cupos = computed(() => Array.from({ length: props.total }, (_, i) => i < props.usados));
</script>

<template>
  <div class="grilla" role="img" :aria-label="`${etiqueta}: ${usados} de ${total} en uso`" :title="`${usados} de ${total} en uso`"
       :style="{ '--columnas': columnas }">
    <i v-for="(lleno, i) in cupos" :key="i" :class="{ lleno }"></i>
  </div>
</template>

<style scoped>
.grilla { display: inline-grid; grid-template-columns: repeat(var(--columnas), 10px); gap: 3px; }
i { width: 10px; height: 10px; border: 1px solid var(--borde-fuerte); border-radius: 1px; }
i.lleno { background: var(--txt); border-color: var(--txt); }
</style>
