<script setup>
import { onBeforeUnmount, onMounted, ref, toRef, useId } from 'vue';
import { useFloating } from '../../lib/floating.js';

// Ayuda corta sobre un elemento: aparece con el mouse y con el foco del teclado, se puede recorrer con el mouse
// sin que se cierre y Escape la oculta. Solo aclara: lo que el operador necesita para decidir va en la pantalla.
const props = defineProps({
  texto: String,
  lado: { type: String, default: 'arriba' }, // 'arriba' | 'abajo' | 'derecha' | 'izquierda'
  demora: { type: Number, default: 300 },
  disabled: Boolean,
});
const id = useId();
const ancla = ref(null);
const globo = ref(null);
const visible = ref(false);
const { estilo } = useFloating(ancla, globo, { abierto: visible, lado: toRef(props, 'lado'), alinear: 'centro' });

let espera;
function mostrar(ms = props.demora) {
  clearTimeout(espera);
  if (!props.disabled) espera = setTimeout(() => (visible.value = true), ms);
}
function ocultar(ms = 100) {
  clearTimeout(espera);
  espera = setTimeout(() => (visible.value = false), ms);
}
const tecla = (e) => { if (e.key === 'Escape' && visible.value) { e.stopPropagation(); ocultar(0); } };

// El globo está siempre en el DOM (oculto), así el elemento queda descripto aunque no se vea.
onMounted(() => {
  ancla.value.firstElementChild?.setAttribute('aria-describedby', id);
  document.addEventListener('keydown', tecla, true);
});
onBeforeUnmount(() => { clearTimeout(espera); document.removeEventListener('keydown', tecla, true); });
</script>

<template>
  <span ref="ancla" class="ancla" @mouseenter="mostrar()" @mouseleave="ocultar()" @focusin="mostrar(0)" @focusout="ocultar(0)">
    <slot />
    <Teleport to="body">
      <div v-show="visible" :id="id" ref="globo" role="tooltip" class="globo" :style="estilo" @mouseenter="mostrar(0)" @mouseleave="ocultar()">
        <slot name="contenido">{{ texto }}</slot>
      </div>
    </Teleport>
  </span>
</template>

<style scoped>
.ancla { display: inline-flex; max-width: 100%; }
.globo { z-index: var(--capa-flotante); max-width: 280px; padding: 6px 10px; background: var(--txt); color: var(--bg); border-radius: var(--r-sm); font-size: .78rem; line-height: 1.4; box-shadow: var(--sombra-1); }
</style>
