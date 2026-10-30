<script setup>
import Icono from './Icono.vue';

// Barra sobre un listado: búsqueda, filtros y acciones. Con filas seleccionadas pasa a modo selección
// y muestra las acciones en lote del slot «seleccion».
defineProps({ busqueda: { type: String, default: '' }, placeholder: { type: String, default: 'Buscar' }, seleccionadas: { type: Number, default: 0 } });
const emit = defineEmits(['update:busqueda', 'quitar-seleccion']);
</script>

<template>
  <div v-if="seleccionadas > 0" class="barra sel">
    <b>{{ seleccionadas }} {{ seleccionadas === 1 ? 'seleccionada' : 'seleccionadas' }}</b>
    <slot name="seleccion" />
    <span class="relleno"></span>
    <button type="button" @click="emit('quitar-seleccion')">Quitar selección</button>
  </div>
  <div v-else class="barra">
    <div class="busca">
      <Icono nombre="buscar" :tam="16" />
      <input type="search" :value="busqueda" :placeholder="placeholder" :aria-label="placeholder" @input="emit('update:busqueda', $event.target.value)">
    </div>
    <slot name="filtros" />
    <span class="relleno"></span>
    <slot name="acciones" />
  </div>
</template>

<style scoped>
.barra { display: flex; flex-wrap: nowrap; gap: 8px; align-items: center; min-height: 56px; padding: 12px 20px; border-bottom: 1px solid var(--borde); }
.barra.sel { background: color-mix(in srgb, var(--senal) 10%, var(--bg)); border-bottom-color: color-mix(in srgb, var(--senal) 45%, var(--borde)); }
.sel b { margin-right: 4px; font: 700 .78rem var(--mono); letter-spacing: .04em; }
.barra :slotted(button:not(.icono)), .barra > button { height: 32px; padding: 0 12px; }
/* La búsqueda absorbe los cambios de ancho de los filtros: se achica antes de que algo salte de línea */
.busca { position: relative; flex: 1 1 180px; min-width: 120px; max-width: 280px; }
.barra :slotted(*) { flex: none; }
@media (max-width: 640px) { .barra { flex-wrap: wrap; } .busca { flex-basis: 100%; max-width: none; } }
.busca .icono-svg { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--sub); pointer-events: none; }
.busca input { height: 32px; padding: 0 10px 0 32px; }
.relleno { flex: 1; }
</style>
