<script setup>
import { computed } from 'vue';
import Icono from './Icono.vue';

// Tarjeta de acción: un atajo grande a algo que se hace seguido («Registrar cobro», «Altas pendientes»),
// con ícono, título, explicación y, si hace falta, un número. Es un solo elemento clicable: un <a> con `href`,
// o un <button> que emite `abrir`. Para una página con router, `enlace` recibe RouterLink y `to` su destino.
const props = defineProps({
  titulo: { type: String, required: true },
  texto: String,
  icono: String,
  contador: [Number, String], // pendientes, por ejemplo
  tono: String, // 'aviso' | 'error' para el contador
  href: String,
  to: [String, Object],
  enlace: [Object, Function],
  disabled: Boolean,
});
const emit = defineEmits(['abrir']);
const etiqueta = computed(() => (props.to && props.enlace ? props.enlace : props.href ? 'a' : 'button'));
const atributos = computed(() => (props.to && props.enlace ? { to: props.to } : props.href ? { href: props.href } : { type: 'button', disabled: props.disabled }));
</script>

<template>
  <component :is="etiqueta" v-bind="atributos" class="accion encuadre" :class="{ deshabilitada: disabled }" @click="emit('abrir')">
    <span v-if="icono" class="icono-caja" aria-hidden="true"><Icono :nombre="icono" :tam="20" /></span>
    <span class="textos"><b>{{ titulo }}</b><small v-if="texto">{{ texto }}</small></span>
    <span v-if="contador !== undefined && contador !== null" class="contador" :class="tono"><span class="oculto">Pendientes: </span>{{ contador }}</span>
    <Icono nombre="derecha" :tam="16" class="flecha" aria-hidden="true" />
  </component>
</template>

<style scoped>
.accion { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 16px; border: 1px solid var(--borde); border-radius: var(--r-lg); background: var(--panel); color: var(--txt); text-align: left; text-decoration: none; cursor: pointer; transition: border-color .15s, background .15s; }
.accion:hover { border-color: var(--borde-fuerte); background: var(--panel-2); }
.accion:hover .flecha { transform: translateX(2px); color: var(--txt); }
.icono-caja { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); background: var(--panel-2); color: var(--senal); }
.textos { display: grid; gap: 2px; flex: 1; min-width: 0; }
.textos b { font-size: .95rem; }
.textos small { font-size: .8rem; color: var(--sub); font-weight: 400; }
.contador { flex: none; padding: 1px 9px; border: 1.5px solid var(--borde-fuerte); border-radius: 99px; font: 700 .76rem var(--mono); }
.contador.aviso { border-color: var(--aviso); color: var(--aviso); }
.contador.error { border-color: var(--error); color: var(--error); }
.flecha { flex: none; color: var(--tenue); transition: transform .15s; }
.deshabilitada { opacity: .5; cursor: default; pointer-events: none; }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { .accion, .flecha { transition: none; } }
</style>
