<script setup>
import Icono from './Icono.vue';
import { cerrarNotificacion, notificaciones } from '../../lib/notificaciones.js';

// Pila de notificaciones abajo a la derecha. Montarla una vez en la raíz de la app y llamar a notificar().
defineProps({ fija: { type: Boolean, default: true } });
function deshacer(n) {
  n.deshacer();
  cerrarNotificacion(n.id);
}
</script>

<template>
  <div class="pila" :class="{ fija }" aria-live="polite">
    <div v-for="n in notificaciones" :key="n.id" class="toast encuadre" role="status">
      <Icono nombre="ok" />
      <div class="txt"><b>{{ n.titulo }}</b><small v-if="n.detalle">{{ n.detalle }}</small></div>
      <button v-if="n.deshacer" type="button" class="enlace" @click="deshacer(n)">Deshacer</button>
      <button type="button" class="icono" aria-label="Cerrar" title="Cerrar" @click="cerrarNotificacion(n.id)"><Icono nombre="cerrar" :tam="14" /></button>
    </div>
  </div>
</template>

<style scoped>
.pila { display: grid; gap: 8px; width: min(380px, calc(100vw - 32px)); }
.pila.fija { position: fixed; z-index: var(--capa-aviso); right: max(16px, env(safe-area-inset-right, 0px)); bottom: max(16px, env(safe-area-inset-bottom, 0px)); }
.toast { position: relative; display: flex; align-items: center; gap: 12px; padding: 10px 8px 10px 12px; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); box-shadow: var(--sombra-1); }
.toast > .icono-svg { color: var(--ok); }
.txt { min-width: 0; flex: 1; }
.txt b { display: block; font-size: .86rem; }
.txt small { display: block; font: 500 .72rem var(--mono); color: var(--sub); }
.enlace { padding: 4px 6px; border: 0; background: none; font-weight: 600; text-decoration: underline; text-decoration-color: var(--senal); text-underline-offset: 3px; }
.icono { width: 26px; height: 26px; border: 0; background: none; }
</style>
