<script setup>
import { computed, useId } from 'vue';
import Icono from './Icono.vue';
import Overlay from './Overlay.vue';

// Panel lateral para ver o editar el detalle de una fila sin perder la lista. Ocupa todo el alto;
// en pantallas chicas, todo el ancho. Queda debajo de los diálogos: un Confirmar abierto desde acá se ve encima.
const props = defineProps({
  abierto: Boolean,
  titulo: { type: String, required: true },
  lado: { type: String, default: 'derecha' }, // 'derecha' | 'izquierda'
  ancho: { type: [Number, String], default: 480 },
});
const emit = defineEmits(['update:abierto', 'cerrar']);
const id = useId();
const anchoCss = computed(() => (typeof props.ancho === 'number' ? `${props.ancho}px` : props.ancho));
function cerrar() {
  emit('update:abierto', false);
  emit('cerrar');
}
</script>

<template>
  <Overlay :abierto="abierto" :posicion="lado" capa="panel" @cerrar="cerrar">
    <aside class="panel" :class="lado" tabindex="-1" role="dialog" aria-modal="true" :aria-labelledby="`${id}-t`" :style="{ '--ancho': anchoCss }">
      <header>
        <div class="titulos">
          <h2 :id="`${id}-t`">{{ titulo }}</h2>
          <slot name="cabecera" />
        </div>
        <button type="button" class="icono" aria-label="Cerrar panel" title="Cerrar" @click="cerrar"><Icono nombre="cerrar" /></button>
      </header>
      <div class="capa-cuerpo"><slot /></div>
      <footer v-if="$slots.acciones"><slot name="acciones" :cerrar="cerrar" /></footer>
    </aside>
  </Overlay>
</template>

<style scoped>
.panel { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; width: min(var(--ancho), 100vw); height: 100dvh; background: var(--panel); box-shadow: var(--sombra-2); }
.panel:focus { outline: none; }
.derecha { border-left: 1px solid var(--borde-fuerte); }
.izquierda { border-right: 1px solid var(--borde-fuerte); }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid var(--borde); }
.titulos { display: grid; gap: 8px; justify-items: start; min-width: 0; }
h2 { margin: 0; font-size: 1.1rem; line-height: 1.3; }
.capa-cuerpo { overflow-y: auto; padding: 18px 20px; }
footer { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; padding: 14px 20px max(14px, env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--borde); }
</style>
