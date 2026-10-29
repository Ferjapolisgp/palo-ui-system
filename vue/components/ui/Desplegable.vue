<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useFloating } from '../../lib/floating.js';

// Filtro desplegable: el botón muestra solo el valor corto y el menú lista las opciones completas.
// La primera opción es el valor por defecto («todos»); si hay otra elegida, el botón se marca con el borde de la señal.
// El menú va al <body>: ningún overflow (tabla, tarjeta, diálogo) lo recorta.
// opciones: [{ valor, texto, corto?, prefijo? }]
const props = defineProps({ modelValue: { type: [String, Number], default: '' }, opciones: { type: Array, required: true }, etiqueta: String });
const emit = defineEmits(['update:modelValue']);

const abierto = ref(false);
const raiz = ref(null);
const menu = ref(null);
const { estilo } = useFloating(raiz, menu, { abierto, lado: 'abajo', alinear: 'inicio', separacion: 4 });
const actual = computed(() => props.opciones.find((o) => String(o.valor) === String(props.modelValue)) ?? props.opciones[0]);
const filtrado = computed(() => actual.value !== props.opciones[0]);

function elegir(o) {
  emit('update:modelValue', o.valor);
  abierto.value = false;
}
const fuera = (e) => { if (raiz.value && !raiz.value.contains(e.target) && !menu.value?.contains(e.target)) abierto.value = false; };
// En captura y deteniendo el evento: si el menú está dentro de un diálogo, Escape cierra solo el menú.
const tecla = (e) => { if (e.key === 'Escape' && abierto.value) { e.stopPropagation(); abierto.value = false; } };
onMounted(() => { document.addEventListener('click', fuera); document.addEventListener('keydown', tecla, true); });
onBeforeUnmount(() => { document.removeEventListener('click', fuera); document.removeEventListener('keydown', tecla, true); });
</script>

<template>
  <div ref="raiz" class="dd">
    <button type="button" class="boton" :class="{ act: filtrado }" aria-haspopup="listbox" :aria-expanded="abierto" @click="abierto = !abierto">
      <span v-if="etiqueta">{{ etiqueta }}</span> <b>{{ actual.corto || actual.texto }}</b>
      <svg viewBox="0 0 8 8" aria-hidden="true"><path :d="abierto ? 'M1 5.5 4 2.5l3 3' : 'M1 2.5l3 3 3-3'" /></svg>
    </button>
    <Teleport to="body">
    <ul v-if="abierto" ref="menu" class="menu" role="listbox" :style="estilo">
      <li v-for="o in opciones" :key="o.valor">
        <button type="button" role="option" :aria-selected="o === actual" :class="{ on: o === actual }" @click="elegir(o)">
          <span><span v-if="o.prefijo" class="pre">{{ o.prefijo }}</span>{{ o.texto }}</span>
        </button>
      </li>
    </ul>
    </Teleport>
  </div>
</template>

<style scoped>
.dd { position: relative; flex: 0 0 auto; }
.boton { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: var(--r-md); border: 1px solid var(--borde); background: var(--panel); color: var(--sub); font-weight: 500; white-space: nowrap; }
.boton:hover { border-color: var(--borde-fuerte); color: var(--txt); }
.boton.act { border-color: var(--senal); }
.boton b { color: var(--txt); font-weight: 600; }
.boton svg { width: 8px; height: 8px; fill: none; stroke: var(--sub); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.menu { z-index: var(--capa-flotante); min-width: 220px; max-height: 320px; overflow-y: auto; margin: 0; padding: 4px; list-style: none; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); box-shadow: var(--sombra-2); }
.menu button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 7px 10px; border: 0; border-radius: var(--r-sm); background: none; text-align: left; color: var(--txt); }
.menu button:hover, .menu button:focus-visible { background: var(--panel-2); }
.menu button.on { font-weight: 600; }
.menu button.on::after { content: "✓"; color: var(--senal); font-weight: 800; }
.pre { font: 700 .69rem var(--mono); letter-spacing: .06em; color: var(--sub); margin-right: 8px; }
</style>
