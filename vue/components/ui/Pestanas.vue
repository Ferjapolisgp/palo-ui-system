<script setup>
import { computed, nextTick, ref, useId } from 'vue';

// Pestañas para cambiar entre paneles de una misma ficha. No carga contenido ni toca la ruta: la app decide qué mostrar.
// items: [{ valor, texto, icono?, contador?, deshabilitada? }]. v-model es el `valor` activo.
// Con un slot por pestaña (#<valor>) el componente dibuja también el panel activo; sin slots, solo la barra.
// Teclado: ← → recorren (sin saltear las deshabilitadas), Inicio y Fin van a los extremos y al enfocar se activa.
const props = defineProps({
  modelValue: String,
  items: { type: Array, default: () => [] },
  etiqueta: { type: String, default: 'Secciones' },
});
const emit = defineEmits(['update:modelValue']);
const id = useId();
const lista = ref(null);
const habilitadas = computed(() => props.items.filter((t) => !t.deshabilitada));
const activa = computed(() => props.items.find((t) => t.valor === props.modelValue) ?? habilitadas.value[0]);

function ir(valor) {
  emit('update:modelValue', valor);
  nextTick(() => lista.value?.querySelector('[aria-selected="true"]')?.focus());
}
function teclas(e) {
  const hab = habilitadas.value;
  const i = hab.findIndex((t) => t.valor === activa.value?.valor);
  const destino = { ArrowRight: hab[(i + 1) % hab.length], ArrowLeft: hab[(i - 1 + hab.length) % hab.length], Home: hab[0], End: hab.at(-1) }[e.key];
  if (!destino) return;
  e.preventDefault();
  ir(destino.valor);
}
</script>

<template>
  <div class="pestanas">
    <div ref="lista" class="lista" role="tablist" :aria-label="etiqueta" @keydown="teclas">
      <button v-for="t in items" :id="`${id}-${t.valor}`" :key="t.valor" type="button" role="tab" class="pestana" :class="{ on: t.valor === activa?.valor }"
              :aria-selected="t.valor === activa?.valor" :aria-controls="`${id}-p-${t.valor}`" :tabindex="t.valor === activa?.valor ? 0 : -1" :disabled="t.deshabilitada"
              @click="emit('update:modelValue', t.valor)">
        {{ t.texto }}<span v-if="t.contador != null" class="contador">{{ typeof t.contador === 'number' ? t.contador.toLocaleString('es-AR') : t.contador }}</span>
      </button>
    </div>
    <div v-if="activa && $slots[activa.valor]" :id="`${id}-p-${activa.valor}`" class="panel" role="tabpanel" :aria-labelledby="`${id}-${activa.valor}`" tabindex="0">
      <slot :name="activa.valor" />
    </div>
  </div>
</template>

<style scoped>
.lista { display: flex; gap: 22px; overflow-x: auto; border-bottom: 1px solid var(--borde); }
.pestana { display: inline-flex; align-items: center; gap: 8px; padding: 8px 0 10px; margin-bottom: -1px; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: none; color: var(--sub); font-weight: 500; white-space: nowrap; }
.pestana:hover:not(:disabled) { background: none; color: var(--txt); border-color: transparent; }
.pestana.on { color: var(--txt); font-weight: 600; border-bottom-color: var(--senal); }
.pestana:disabled { color: var(--tenue); cursor: not-allowed; opacity: .7; }
.contador { padding: 1px 7px; background: color-mix(in srgb, var(--sub) 16%, transparent); font: 600 .68rem/1.3 var(--ui); color: color-mix(in srgb, var(--sub) 80%, var(--txt)); }
.panel { padding-top: 14px; }
.panel:focus-visible { outline-offset: -2px; }
</style>
