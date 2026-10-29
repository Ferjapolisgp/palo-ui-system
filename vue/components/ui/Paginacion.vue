<script setup>
import { computed } from 'vue';

// Rango visible a la izquierda («1–25 de 1.284 solicitudes») y salto entre páginas a la derecha.
// Muestra la primera, la última y las vecinas de la actual; el resto se resume con «…».
const props = defineProps({ pagina: { type: Number, default: 1 }, total: { type: Number, required: true }, porPagina: { type: Number, default: 25 }, unidad: { type: String, default: 'resultados' } });
const emit = defineEmits(['update:pagina']);

const cantidad = computed(() => Math.max(1, Math.ceil(props.total / props.porPagina)));
const fmt = (n) => n.toLocaleString('es-AR');
const rango = computed(() => {
  if (!props.total) return `0 ${props.unidad}`;
  const desde = (props.pagina - 1) * props.porPagina + 1;
  return `${fmt(desde)}–${fmt(Math.min(props.pagina * props.porPagina, props.total))} de ${fmt(props.total)} ${props.unidad}`;
});
const botones = computed(() => {
  const n = cantidad.value, p = props.pagina;
  const nums = [...new Set([1, p - 1, p, p + 1, n])].filter((x) => x >= 1 && x <= n).sort((a, b) => a - b);
  return nums.flatMap((x, i) => (i && x - nums[i - 1] > 1 ? [{ salto: true, clave: 's' + x }, { n: x, clave: x }] : [{ n: x, clave: x }]));
});
const ir = (p) => emit('update:pagina', Math.min(cantidad.value, Math.max(1, p)));
</script>

<template>
  <nav class="pag" aria-label="Paginación">
    <span class="rango">{{ rango }}</span>
    <div class="botones">
      <button type="button" aria-label="Página anterior" :disabled="pagina <= 1" @click="ir(pagina - 1)">‹</button>
      <template v-for="b in botones" :key="b.clave">
        <span v-if="b.salto" class="salto">…</span>
        <button v-else type="button" :class="{ on: b.n === pagina }" :aria-current="b.n === pagina ? 'page' : undefined" @click="ir(b.n)">{{ fmt(b.n) }}</button>
      </template>
      <button type="button" aria-label="Página siguiente" :disabled="pagina >= cantidad" @click="ir(pagina + 1)">›</button>
    </div>
  </nav>
</template>

<style scoped>
.pag { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; font-size: .82rem; }
.rango, .salto { color: var(--sub); }
.botones { display: flex; align-items: center; gap: 4px; }
button { min-width: 30px; height: 30px; padding: 0 8px; font: 600 .75rem var(--mono); }
button.on { border-color: var(--senal); background: color-mix(in srgb, var(--senal) 14%, var(--panel)); }
</style>
