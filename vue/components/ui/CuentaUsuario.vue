<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useFloating } from '../../lib/floating.js';
import Avatar from './Avatar.vue';
import Icono from './Icono.vue';
import Skeleton from './Skeleton.vue';

// La persona que está usando la app, para el pie de BarraLateral (slot `pie`, con `:colapsada` de la barra).
// Con `opciones` es un botón que abre un menú (Mi perfil, Tema, Salir…); sin ellas, solo identifica.
// La librería no cierra sesión ni cambia de cuenta: avisa con `elegir` y la app decide.
// opciones: [{ texto, icono?, valor, tono? }]; tono: 'error' para lo destructivo.
// variante: 'completa' (nombre y detalle) | 'compacta' (una línea) | 'tarjeta' (enmarcada con encuadre).
// colapsada: solo el avatar, grande y centrado; el nombre queda en el title y el aria-label.
const props = defineProps({
  nombre: String,
  detalle: String,
  imagen: String,
  variante: { type: String, default: 'completa' },
  colapsada: Boolean,
  cargando: Boolean,
  opciones: { type: Array, default: () => [] },
});
const emit = defineEmits(['elegir']);

const abierto = ref(false);
const raiz = ref(null);
const boton = ref(null);
const menu = ref(null);
// Pegada abajo de la pantalla, el menú sube; en la barra mini sale a la derecha, alineado por abajo.
const { estilo } = useFloating(raiz, menu, { abierto, lado: computed(() => (props.colapsada ? 'derecha' : 'arriba')), alinear: computed(() => (props.colapsada ? 'fin' : 'inicio')), separacion: 6 });

const interactiva = computed(() => props.opciones.length > 0);
const tam = computed(() => (props.colapsada ? 44 : props.variante === 'compacta' ? 28 : 36));
const rotulo = computed(() => props.nombre || 'Sin identificar');

const items = () => [...(menu.value?.querySelectorAll('[role="menuitem"]') ?? [])];
async function abrir() {
  abierto.value = true;
  await nextTick();
  await nextTick(); // el menú se mide recién en el tick siguiente: antes está oculto y no recibe foco
  items()[0]?.focus();
}
function cerrar(devolverFoco = true) {
  abierto.value = false;
  if (devolverFoco) boton.value?.focus();
}
function elegir(o) {
  emit('elegir', o);
  cerrar();
}
// Flechas recorren el menú en círculo; Inicio y Fin saltan a los extremos; Tab lo cierra.
function teclasMenu(e) {
  const lista = items();
  const i = lista.indexOf(document.activeElement);
  const ir = (n) => { e.preventDefault(); lista[(n + lista.length) % lista.length]?.focus(); };
  if (e.key === 'ArrowDown') ir(i + 1);
  else if (e.key === 'ArrowUp') ir(i - 1);
  else if (e.key === 'Home') ir(0);
  else if (e.key === 'End') ir(lista.length - 1);
  else if (e.key === 'Tab') cerrar(false);
}
const fuera = (e) => { if (abierto.value && !raiz.value?.contains(e.target) && !menu.value?.contains(e.target)) cerrar(false); };
// En captura y deteniendo el evento: si la barra vive dentro de un diálogo, Escape cierra solo el menú.
const escape = (e) => { if (e.key === 'Escape' && abierto.value) { e.stopPropagation(); cerrar(); } };
onMounted(() => { document.addEventListener('click', fuera); document.addEventListener('keydown', escape, true); });
onBeforeUnmount(() => { document.removeEventListener('click', fuera); document.removeEventListener('keydown', escape, true); });
</script>

<template>
  <div ref="raiz" class="cuenta" :class="[`v-${variante}`, { colapsada, encuadre: variante === 'tarjeta' && !colapsada }]" :aria-busy="cargando || undefined">
    <component :is="interactiva ? 'button' : 'div'" ref="boton" class="cuenta-fila" :type="interactiva ? 'button' : undefined" :title="colapsada ? rotulo : undefined"
               :aria-label="colapsada ? rotulo : undefined" :aria-haspopup="interactiva ? 'menu' : undefined" :aria-expanded="interactiva ? abierto : undefined"
               @click="interactiva && (abierto ? cerrar() : abrir())">
      <Skeleton v-if="cargando" :lineas="1" :ancho="colapsada ? 44 : 140" etiqueta="Cargando cuenta…" />
      <template v-else>
        <Avatar :nombre="nombre" :imagen="imagen" :tam="tam" />
        <span v-if="!colapsada" class="cuenta-txt">
          <b>{{ rotulo }}</b>
          <slot name="detalle"><small v-if="detalle && variante !== 'compacta'">{{ detalle }}</small></slot>
        </span>
        <Icono v-if="interactiva && !colapsada" nombre="derecha" :tam="14" class="cuenta-flecha" :class="{ abierta: abierto }" />
      </template>
    </component>
    <Teleport to="body">
      <div v-if="abierto" ref="menu" class="cuenta-menu encuadre" role="menu" :aria-label="`Cuenta de ${rotulo}`" :style="estilo" @keydown="teclasMenu">
        <slot name="menu" :cerrar="cerrar">
          <button v-for="o in opciones" :key="o.valor" type="button" role="menuitem" class="cuenta-op" :class="o.tono && `tono-${o.tono}`" @click="elegir(o)">
            <Icono v-if="o.icono" :nombre="o.icono" :tam="16" />{{ o.texto }}
          </button>
        </slot>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.cuenta { position: relative; min-width: 0; }
.cuenta-fila { display: flex; align-items: center; gap: 10px; width: 100%; min-width: 0; padding: 6px 8px; border: 1px solid transparent; background: none; color: var(--txt); text-align: left; }
button.cuenta-fila { cursor: pointer; }
button.cuenta-fila:hover { background: color-mix(in srgb, var(--txt) 5%, transparent); border-color: transparent; }
.cuenta-txt { display: grid; min-width: 0; flex: 1; }
.cuenta-txt b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .86rem; font-weight: 600; }
.cuenta-txt small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 500 .7rem var(--mono); letter-spacing: .04em; color: var(--sub); }
.cuenta-flecha { flex: none; color: var(--sub); transform: rotate(-90deg); transition: transform .12s; }
.cuenta-flecha.abierta { transform: rotate(90deg); }
.v-compacta .cuenta-fila { padding: 4px 6px; }
.v-tarjeta .cuenta-fila { padding: 10px 12px; background: var(--panel-2); border-color: var(--borde); }
.v-tarjeta button.cuenta-fila:hover { background: color-mix(in srgb, var(--txt) 5%, var(--panel-2)); }
.colapsada .cuenta-fila { justify-content: center; padding: 4px 0; }
.cuenta-menu { z-index: var(--capa-flotante); min-width: 210px; padding: 4px; background: var(--panel); border: 1px solid var(--borde-fuerte); box-shadow: var(--sombra-2); }
.cuenta-op { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: 0; background: none; color: var(--txt); text-align: left; }
.cuenta-op:hover, .cuenta-op:focus-visible { background: var(--panel-2); }
.cuenta-op.tono-error { color: color-mix(in srgb, var(--error) 80%, var(--txt)); }
.cuenta-op :deep(.icono-svg) { color: var(--sub); }
.cuenta-op.tono-error :deep(.icono-svg) { color: inherit; }
@media (prefers-reduced-motion: reduce) { .cuenta-flecha { transition: none; } }
</style>
