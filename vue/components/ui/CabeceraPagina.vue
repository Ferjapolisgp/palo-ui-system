<script setup>
// Cabecera de pantalla: título con su serie y, debajo, las pestañas de vista. Una pestaña que todavía no existe
// se muestra deshabilitada (con `ayuda` como explicación) en lugar de omitirse.
// tabs: [{ valor, texto, deshabilitada?, ayuda? }]
defineProps({ titulo: { type: String, required: true }, serie: String, tabs: { type: Array, default: () => [] }, modelValue: String });
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <header class="cab">
    <div class="fila">
      <h1>{{ titulo }}</h1>
      <span v-if="serie" class="serie">{{ serie }}</span>
      <span class="relleno"></span>
      <slot />
    </div>
    <div v-if="tabs.length" class="tabs" role="tablist">
      <button v-for="t in tabs" :key="t.valor" role="tab" class="tab" :class="{ on: t.valor === modelValue }" :aria-selected="t.valor === modelValue"
              :disabled="t.deshabilitada" :title="t.deshabilitada ? (t.ayuda || 'Todavía no disponible') : undefined"
              @click="emit('update:modelValue', t.valor)">{{ t.texto }}</button>
    </div>
  </header>
</template>

<style scoped>
.cab { display: flex; flex-direction: column; gap: 12px; padding: 18px 24px 0; border-bottom: 1px solid var(--borde); }
.fila { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
h1 { margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em; }
.serie { padding: 2px 6px; border-radius: var(--r-sm); background: var(--senal); color: var(--senal-txt); font: 700 .62rem var(--mono); letter-spacing: .12em; }
.relleno { flex: 1; }
.tabs { display: flex; gap: 22px; overflow-x: auto; }
.tab { padding: 6px 0 10px; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: none; color: var(--sub); font-weight: 500; white-space: nowrap; }
.tab:hover:not(:disabled) { color: var(--txt); border-color: transparent; }
.tab.on { color: var(--txt); font-weight: 600; border-bottom-color: var(--senal); }
.tab:disabled { color: var(--tenue); cursor: not-allowed; opacity: .7; }
</style>
