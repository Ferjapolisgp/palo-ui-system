<script setup>
import { onBeforeUnmount, onMounted, ref, toRef } from 'vue';
import { useFocusTrap } from '../../lib/focus.js';

// Capa modal: velo, foco atrapado, scroll del fondo bloqueado, Escape y clic afuera. Va al <body>.
// No dibuja la caja: la pone quien la usa (Modal, Drawer, Confirmar, o una propia) en el slot.
const props = defineProps({
  abierto: Boolean,
  posicion: { type: String, default: 'centro' }, // 'centro' | 'derecha' | 'izquierda'
  cerrarAfuera: { type: Boolean, default: true },
  cerrarConEscape: { type: Boolean, default: true },
  capa: { type: String, default: 'modal' }, // 'modal' | 'panel'
});
const emit = defineEmits(['cerrar']);
const raiz = ref(null);
const { esSuperior } = useFocusTrap(raiz, toRef(props, 'abierto'));

// El clic cuenta como «afuera» solo si empezó y terminó en el velo: arrastrar al seleccionar texto no cierra.
let empezoEnVelo = false;
const alPresionar = (e) => { empezoEnVelo = e.target === e.currentTarget; };
const alSoltar = (e) => {
  if (props.cerrarAfuera && empezoEnVelo && e.target === e.currentTarget) emit('cerrar');
  empezoEnVelo = false;
};
const tecla = (e) => {
  if (e.key === 'Escape' && props.abierto && props.cerrarConEscape && esSuperior()) { e.stopPropagation(); emit('cerrar'); }
};
onMounted(() => document.addEventListener('keydown', tecla));
onBeforeUnmount(() => document.removeEventListener('keydown', tecla));
</script>

<template>
  <Teleport to="body">
    <Transition name="capa" appear>
      <div v-if="abierto" ref="raiz" class="velo" :class="[posicion, `capa-${capa}`]" tabindex="-1"
           @pointerdown="alPresionar" @click="alSoltar">
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.velo { position: fixed; inset: 0; z-index: var(--capa-modal); display: grid; overflow-y: auto; padding: 16px; background: var(--velo); outline: none; }
.velo.capa-panel { z-index: var(--capa-panel); }
.velo.centro { place-items: center; }
.velo.derecha, .velo.izquierda { padding: 0; overflow: hidden; align-items: stretch; }
.velo.derecha { justify-items: end; }
.velo.izquierda { justify-items: start; }

.capa-enter-active, .capa-leave-active { transition: opacity .18s ease; }
.capa-enter-active > :slotted(*), .capa-leave-active > :slotted(*) { transition: transform .22s cubic-bezier(.2, .8, .2, 1); }
.capa-enter-from, .capa-leave-to { opacity: 0; }
.capa-enter-from.centro > :slotted(*), .capa-leave-to.centro > :slotted(*) { transform: translateY(8px) scale(.98); }
.capa-enter-from.derecha > :slotted(*), .capa-leave-to.derecha > :slotted(*) { transform: translateX(32px); }
.capa-enter-from.izquierda > :slotted(*), .capa-leave-to.izquierda > :slotted(*) { transform: translateX(-32px); }
@media (prefers-reduced-motion: reduce) {
  .capa-enter-active, .capa-leave-active, .capa-enter-active > :slotted(*), .capa-leave-active > :slotted(*) { transition: none; }
}
</style>
