<script setup>
import { computed, watch } from 'vue';
import Icono from './Icono.vue';
import { cerrarNotificacion, cerrarTodas, notificaciones, pausarNotificacion, reanudarNotificacion } from '../../lib/notificaciones.js';

// Pila de notificaciones. Montarla una vez en la raíz de la app y llamar a notificar() o alertar().
// posicion: 'abajo-derecha' (por defecto) | 'abajo-izquierda' | 'arriba-derecha' | 'arriba-izquierda' | 'arriba-centro' | 'abajo-centro'.
// maximo: cuántas se ven a la vez; las demás se resumen en «+N más». canal: solo dibuja las de ese canal.
// fija: false la dibuja en su lugar del documento (vistas previas, demos).
const props = defineProps({
  fija: { type: Boolean, default: true },
  posicion: { type: String, default: 'abajo-derecha' },
  maximo: { type: Number, default: 4 },
  canal: { type: String, default: '' },
});

// Cada tono con un ícono de forma distinta: el color nunca es el único aviso.
const ICONO = { ok: 'ok', info: 'info', aviso: 'alerta', error: 'error' };
const propias = computed(() => notificaciones.filter((n) => n.canal === props.canal));
const visibles = computed(() => propias.value.slice(0, props.maximo));
const ocultas = computed(() => propias.value.length - visibles.value.length);
// Las que quedan en «+N más» no gastan su tiempo: arrancan a contar cuando se ven.
watch(() => propias.value.map((n) => n.id), (ids) => {
  ids.forEach((id, i) => (i < props.maximo ? reanudarNotificacion(id, 'oculta') : pausarNotificacion(id, 'oculta')));
}, { immediate: true });

function hacer(n) {
  n.accion.hacer();
  cerrarNotificacion(n.id);
}
function deshacer(n) {
  n.deshacer();
  cerrarNotificacion(n.id);
}
</script>

<template>
  <div class="pila" :class="[{ fija }, posicion]" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="n in visibles" :key="n.id" :class="n.variante === 'alerta' ? ['alerta', `tono-${n.tono}`] : ['toast', 'encuadre', `tono-${n.tono}`, n.variante]"
           :role="n.tono === 'error' || n.variante === 'alerta' ? 'alert' : 'status'"
           @mouseenter="pausarNotificacion(n.id)" @mouseleave="reanudarNotificacion(n.id)" @focusin="pausarNotificacion(n.id, 'foco')" @focusout="reanudarNotificacion(n.id, 'foco')">
        <!-- Alerta: placa con emblema y título de calca dentro de un marco de franjas de precaución -->
        <div v-if="n.variante === 'alerta'" class="alerta-placa">
          <span class="alerta-emblema"><Icono :nombre="n.icono || (n.tono === 'error' ? 'peligro' : 'alerta')" :tam="30" /></span>
          <div class="alerta-cuerpo">
            <p class="alerta-titulo">{{ n.titulo }}</p>
            <p v-if="n.detalle" class="alerta-detalle">{{ n.detalle }}</p>
            <!-- Error obliga a actuar: sin cruz, solo con el botón. Si no trae acción, «Entendido» la cierra. -->
            <div v-if="n.accion || n.deshacer || n.tono === 'error'" class="alerta-acciones">
              <button v-if="n.accion" type="button" @click="hacer(n)">{{ n.accion.texto }}</button>
              <button v-else-if="n.tono === 'error'" type="button" @click="cerrarNotificacion(n.id)">Entendido</button>
              <button v-if="n.deshacer" type="button" @click="deshacer(n)">Deshacer</button>
            </div>
          </div>
          <button v-if="n.tono !== 'error'" type="button" class="icono alerta-cerrar" aria-label="Cerrar alerta" title="Cerrar" @click="cerrarNotificacion(n.id)"><Icono nombre="cerrar" :tam="16" /></button>
        </div>
        <template v-else>
          <Icono :nombre="n.icono || ICONO[n.tono] || 'ok'" class="toast-marca" />
          <div class="toast-txt"><b>{{ n.titulo }}</b><small v-if="n.detalle && n.variante !== 'compacta'">{{ n.detalle }}</small></div>
          <button v-if="n.accion" type="button" class="enlace" @click="hacer(n)">{{ n.accion.texto }}</button>
          <button v-if="n.deshacer" type="button" class="enlace" @click="deshacer(n)">Deshacer</button>
          <button type="button" class="icono" aria-label="Cerrar" title="Cerrar" @click="cerrarNotificacion(n.id)"><Icono nombre="cerrar" :tam="14" /></button>
          <!-- Tiempo que queda: se vacía y se frena junto con el reloj de la notificación -->
          <i v-if="n.duracion" class="toast-tiempo" aria-hidden="true" :style="{ animationDuration: `${n.duracion}ms`, animationPlayState: n.pausada ? 'paused' : 'running' }" />
        </template>
      </div>
    </TransitionGroup>
    <p v-if="ocultas > 0" class="pila-mas">+{{ ocultas }} más <button type="button" class="enlace" @click="cerrarTodas(canal)">Cerrar todas</button></p>
  </div>
</template>

<style scoped>
.pila { display: grid; gap: 8px; width: min(400px, calc(100vw - 32px)); }
.pila.fija { position: fixed; z-index: var(--capa-aviso); --m: 16px; }
.fija.abajo-derecha { right: max(var(--m), env(safe-area-inset-right, 0px)); bottom: max(var(--m), env(safe-area-inset-bottom, 0px)); }
.fija.abajo-izquierda { left: max(var(--m), env(safe-area-inset-left, 0px)); bottom: max(var(--m), env(safe-area-inset-bottom, 0px)); }
.fija.arriba-derecha { right: max(var(--m), env(safe-area-inset-right, 0px)); top: max(var(--m), env(safe-area-inset-top, 0px)); }
.fija.arriba-izquierda { left: max(var(--m), env(safe-area-inset-left, 0px)); top: max(var(--m), env(safe-area-inset-top, 0px)); }
.fija.arriba-centro { left: 50%; transform: translateX(-50%); top: max(var(--m), env(safe-area-inset-top, 0px)); }
.fija.abajo-centro { left: 50%; transform: translateX(-50%); bottom: max(var(--m), env(safe-area-inset-bottom, 0px)); }

/* Notificación: el color del tono va en el ícono, el borde y las esquinas de encuadre; el texto, en colores de texto */
.toast { --c: var(--ok); position: relative; overflow: hidden; display: flex; align-items: center; gap: 12px; padding: 10px 8px 10px 12px; background: var(--panel); --encuadre-color: var(--c); border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); border-radius: var(--r-md); box-shadow: var(--sombra-1); }
.toast.tono-info { --c: var(--info); } .toast.tono-aviso { --c: var(--aviso); } .toast.tono-error { --c: var(--error); }
.toast.tono-error { background: color-mix(in srgb, var(--error) 8%, var(--panel)); }
.toast.compacta { padding-block: 6px; }
.toast-marca { color: var(--c); }
.toast-txt { min-width: 0; flex: 1; }
.toast-txt b { display: block; font-size: .86rem; }
.compacta .toast-txt b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.toast-txt small { display: block; font: 500 .72rem var(--mono); color: var(--sub); }
.enlace { padding: 4px 6px; border: 0; background: none; color: var(--txt); font-weight: 600; text-decoration: underline; text-decoration-color: var(--senal); text-underline-offset: 3px; white-space: nowrap; }
.icono { width: 26px; height: 26px; border: 0; background: none; }
.toast-tiempo { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--c); opacity: .6; transform-origin: left; animation: vaciar linear forwards; }
@keyframes vaciar { from { transform: scaleX(1); } to { transform: scaleX(0); } }
.pila-mas { display: flex; align-items: center; justify-content: flex-end; gap: 6px; margin: 0; font: 600 .72rem var(--mono); color: var(--sub); }

/* Alerta: placa de precaución. Marco de franjas del tono, emblema con borde y título en letra de calca.
   Clases con prefijo: el scoped no protege de una .titulo o .cuerpo global de la app. */
.alerta { --c: var(--error); position: relative; padding: 9px; background: repeating-linear-gradient(-45deg, var(--c) 0 9px, color-mix(in srgb, var(--c) 18%, var(--panel)) 9px 18px); border-radius: var(--r-md); box-shadow: var(--sombra-2); }
.alerta.tono-aviso { --c: var(--aviso); }
.alerta-placa { position: relative; display: flex; gap: 14px; align-items: flex-start; padding: 14px 40px 14px 14px; background: color-mix(in srgb, var(--c) 24%, var(--panel)); border-radius: var(--r-sm); color: var(--txt); }
.alerta-emblema { display: grid; place-items: center; width: 54px; height: 54px; flex: none; border: 2px solid color-mix(in srgb, var(--c) 70%, var(--txt)); color: var(--txt); }
.alerta-cuerpo { display: grid; gap: 6px; min-width: 0; }
.alerta-titulo { margin: 0; font-family: var(--display); font-weight: 800; font-stretch: 125%; font-size: 1.5rem; line-height: 1; text-transform: uppercase; letter-spacing: .02em; }
.alerta-detalle { margin: 0; font-size: .84rem; line-height: 1.45; color: color-mix(in srgb, var(--txt) 88%, var(--c)); }
.alerta-acciones { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.alerta-acciones button { height: 30px; padding: 0 12px; font-size: .8rem; color: var(--txt); border-color: color-mix(in srgb, var(--c) 60%, var(--txt)); background: color-mix(in srgb, var(--c) 30%, var(--panel)); }
/* La cruz en el tono pleno, un punto más intenso que el marco */
.alerta-cerrar { position: absolute; top: 8px; right: 8px; color: color-mix(in srgb, var(--c) 85%, var(--txt)); }
.alerta-cerrar:hover { color: var(--c); background: color-mix(in srgb, var(--c) 18%, transparent); }

/* Entrada y salida: un desplazamiento corto y opacidad */
.toast-enter-active, .toast-leave-active { transition: opacity .12s, transform .12s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px); }
@media (prefers-reduced-motion: reduce) { .toast-enter-active, .toast-leave-active { transition: none; } .toast-tiempo { animation: none; opacity: 0; } }
</style>
