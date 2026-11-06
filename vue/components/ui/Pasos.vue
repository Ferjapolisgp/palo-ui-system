<script setup>
import { computed } from 'vue';
import Icono from './Icono.vue';

// Indicador de pasos de un proceso (altas, enviar a firmar, cobros guiados). No valida ni avanza: la app decide.
// pasos: [{ valor, texto, detalle?, estado? }]; estado: 'hecho' | 'actual' | 'error' | 'pendiente'.
// Sin `estado`, se deduce de `actual`: lo anterior es «hecho», ese paso es «actual» y lo demás «pendiente».
// Con `navegable`, los pasos hechos son botones que emiten `elegir`. Cada estado lleva número o ícono, nunca solo color.
const props = defineProps({
  pasos: { type: Array, default: () => [] },
  actual: String,
  orientacion: { type: String, default: 'horizontal' }, // 'horizontal' | 'vertical'
  navegable: Boolean,
  etiqueta: { type: String, default: 'Pasos' },
});
const emit = defineEmits(['elegir']);

const NOMBRE = { hecho: 'completado', actual: 'actual', error: 'con error', pendiente: 'pendiente' };
const lista = computed(() => {
  const i = props.pasos.findIndex((p) => p.valor === props.actual);
  return props.pasos.map((p, n) => ({ ...p, n: n + 1, estado: p.estado ?? (i < 0 ? 'pendiente' : n < i ? 'hecho' : n === i ? 'actual' : 'pendiente') }));
});
</script>

<template>
  <ol class="pasos" :class="orientacion" :aria-label="etiqueta">
    <li v-for="p in lista" :key="p.valor" class="paso" :class="`e-${p.estado}`" :aria-current="p.estado === 'actual' ? 'step' : undefined">
      <component :is="navegable && p.estado === 'hecho' ? 'button' : 'div'" class="paso-cuerpo" :type="navegable && p.estado === 'hecho' ? 'button' : undefined"
                 @click="navegable && p.estado === 'hecho' && emit('elegir', p)">
        <span class="marca" aria-hidden="true">
          <Icono v-if="p.estado === 'hecho'" nombre="ok" :tam="14" /><Icono v-else-if="p.estado === 'error'" nombre="alerta" :tam="14" /><template v-else>{{ p.n }}</template>
        </span>
        <span class="txt"><b>{{ p.texto }}</b><small v-if="p.detalle">{{ p.detalle }}</small></span>
        <span class="oculto">{{ NOMBRE[p.estado] }}</span>
      </component>
    </li>
  </ol>
</template>

<style scoped>
.pasos { display: flex; margin: 0; padding: 0; list-style: none; }
.pasos.vertical { flex-direction: column; }
.paso { position: relative; flex: 1; min-width: 0; }
.paso-cuerpo { display: flex; align-items: flex-start; gap: 10px; width: 100%; padding: 0 12px 0 0; border: 0; background: none; color: var(--sub); text-align: left; font: inherit; }
button.paso-cuerpo { cursor: pointer; }
button.paso-cuerpo:hover { background: none; color: var(--txt); }
.marca { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid var(--borde-fuerte); background: var(--panel); font: 700 .72rem var(--mono); color: var(--sub); }
.txt { display: grid; min-width: 0; padding-top: 2px; }
.txt b { font-size: .86rem; font-weight: 600; }
.txt small { font-size: .74rem; color: var(--tenue); }
/* Línea que une cada paso con el siguiente */
.horizontal .paso:not(:last-child)::after { content: ""; position: absolute; top: 13px; left: 0; right: 0; height: 1px; background: var(--borde); z-index: 0; transform: translateX(34px); width: calc(100% - 44px); }
.vertical .paso { padding-bottom: 18px; }
.vertical .paso:not(:last-child)::after { content: ""; position: absolute; top: 30px; bottom: 4px; left: 13px; width: 1px; background: var(--borde); }
.paso-cuerpo > * { position: relative; z-index: 1; }
.e-actual .paso-cuerpo { color: var(--txt); }
.e-actual .marca { border-color: var(--senal); color: var(--txt); background: color-mix(in srgb, var(--senal) 14%, var(--panel)); }
.e-hecho .paso-cuerpo { color: var(--txt); }
.e-hecho .marca { border-color: color-mix(in srgb, var(--ok) 45%, transparent); background: color-mix(in srgb, var(--ok) 16%, transparent); color: color-mix(in srgb, var(--ok) 78%, var(--txt)); }
.e-error .paso-cuerpo { color: var(--txt); }
.e-error .marca { border-color: color-mix(in srgb, var(--error) 45%, transparent); background: color-mix(in srgb, var(--error) 16%, transparent); color: color-mix(in srgb, var(--error) 78%, var(--txt)); }
.e-error .txt small { color: color-mix(in srgb, var(--error) 78%, var(--txt)); }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 560px) { .pasos.horizontal { flex-direction: column; } .horizontal .paso { padding-bottom: 16px; } .horizontal .paso:not(:last-child)::after { top: 30px; bottom: 4px; left: 13px; right: auto; width: 1px; height: auto; transform: none; } }
</style>
