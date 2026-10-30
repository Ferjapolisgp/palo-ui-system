<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRef, useId, watch } from 'vue';
import { useFloating } from '../../lib/floating.js';

// Cuadro que se abre con un clic junto a su disparador y puede tener controles (casillas, botones, un formulario corto).
// El foco entra al abrirse; Escape, clic afuera o salir con Tab lo cierran. Funciona solo o con v-model:abierto.
const props = defineProps({
  abierto: { type: Boolean, default: undefined },
  titulo: String,
  lado: { type: String, default: 'abajo' },
  alinear: { type: String, default: 'inicio' }, // 'inicio' | 'centro' | 'fin'
});
const emit = defineEmits(['update:abierto']);
const id = useId();
const ancla = ref(null);
const panel = ref(null);
const interno = ref(false);
const abierto = computed({
  get: () => props.abierto ?? interno.value,
  set: (v) => { interno.value = v; emit('update:abierto', v); },
});
const { estilo } = useFloating(ancla, panel, { abierto, lado: toRef(props, 'lado'), alinear: toRef(props, 'alinear') });
const disparador = () => ancla.value?.firstElementChild;

function cerrar(devolverFoco = true) {
  if (!abierto.value) return;
  abierto.value = false;
  if (devolverFoco) disparador()?.focus();
}
const alternar = () => (abierto.value ? cerrar(false) : (abierto.value = true));

watch(abierto, async (si) => {
  disparador()?.setAttribute('aria-expanded', String(si));
  if (!si) return;
  await nextTick();
  const el = panel.value;
  (el?.querySelector('[autofocus]') ?? el?.querySelector('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])') ?? el)?.focus();
});

const fuera = (e) => { if (abierto.value && !ancla.value?.contains(e.target) && !panel.value?.contains(e.target)) cerrar(false); };
const tecla = (e) => { if (e.key === 'Escape' && abierto.value) { e.stopPropagation(); cerrar(); } };
// Salir con Tab: el panel está al final del <body>, así que se cierra y el foco sigue su camino.
const alSalir = (e) => { if (e.relatedTarget && !panel.value?.contains(e.relatedTarget) && !ancla.value?.contains(e.relatedTarget)) cerrar(false); };

onMounted(() => {
  const d = disparador();
  d?.setAttribute('aria-haspopup', 'dialog');
  d?.setAttribute('aria-controls', id);
  d?.setAttribute('aria-expanded', String(abierto.value));
  document.addEventListener('click', fuera);
  document.addEventListener('keydown', tecla, true);
});
onBeforeUnmount(() => { document.removeEventListener('click', fuera); document.removeEventListener('keydown', tecla, true); });
</script>

<template>
  <span ref="ancla" class="ancla" @click="alternar">
    <slot :abierto="abierto" />
    <Teleport to="body">
      <div v-if="abierto" :id="id" ref="panel" class="panel encuadre" role="dialog" :aria-label="titulo" tabindex="-1" :style="estilo" @focusout="alSalir">
        <p v-if="titulo" class="popover-titulo">{{ titulo }}</p>
        <slot name="contenido" :cerrar="cerrar" />
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.ancla { display: inline-flex; }
.panel { z-index: var(--capa-flotante); display: grid; gap: 10px; min-width: 200px; max-width: min(360px, calc(100vw - 16px)); padding: 12px 14px; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); box-shadow: var(--sombra-2); }
.panel:focus { outline: none; }
.popover-titulo { margin: 0; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
</style>
