<script setup>
import { nextTick, ref, watch } from 'vue';

// Tooltip de los gráficos. Se ubica arriba del punto (x, y) y se da vuelta si no entra a la derecha.
// filas: [{ color, nombre, valor }]. El color va en el cuadradito; el texto, en colores de texto.
const props = defineProps({ x: Number, y: Number, ancho: Number, titulo: String, filas: { type: Array, default: () => [] } });
const caja = ref(null);
const pos = ref({ left: 0, top: 0 });

watch(() => [props.x, props.y, props.titulo, props.filas], async () => {
  await nextTick();
  const el = caja.value;
  if (!el) return;
  let left = props.x + 14;
  if (left + el.offsetWidth > props.ancho) left = props.x - 14 - el.offsetWidth;
  pos.value = { left: Math.max(0, left), top: Math.max(0, props.y - el.offsetHeight - 10) };
}, { immediate: true });
</script>

<template>
  <div ref="caja" class="tip" :style="{ left: pos.left + 'px', top: pos.top + 'px' }">
    <div v-if="titulo" class="t">{{ titulo }}</div>
    <div v-for="f in filas" :key="f.nombre" class="fila"><i v-if="f.color" :style="{ background: f.color }"></i><span>{{ f.nombre }}</span><b>{{ f.valor }}</b></div>
  </div>
</template>

<style scoped>
.tip { position: absolute; z-index: 10; pointer-events: none; display: grid; gap: 4px; min-width: 150px; padding: 8px 10px; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); box-shadow: var(--sombra-1); font-size: .78rem; white-space: nowrap; }
.t { font: 600 .66rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--sub); }
.fila { display: flex; align-items: center; gap: 8px; }
.fila i { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.fila b { margin-left: auto; padding-left: 14px; font: 700 .78rem var(--mono); }
</style>
