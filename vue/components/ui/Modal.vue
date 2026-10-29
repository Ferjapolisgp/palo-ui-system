<script setup>
import { useId } from 'vue';
import Icono from './Icono.vue';
import Overlay from './Overlay.vue';

// Diálogo genérico: título, cuerpo que se desplaza solo y acciones al pie. Para confirmar algo sin vuelta atrás
// está Confirmar; para ver el detalle de una fila sin perder la lista, Drawer.
const props = defineProps({
  abierto: Boolean,
  titulo: { type: String, required: true },
  ancho: { type: String, default: 'medio' }, // 'chico' 400 px | 'medio' 560 px | 'grande' 800 px
  cerrable: { type: Boolean, default: true },
});
const emit = defineEmits(['update:abierto', 'cerrar']);
const id = useId();
function cerrar() {
  if (!props.cerrable) return;
  emit('update:abierto', false);
  emit('cerrar');
}
</script>

<template>
  <Overlay :abierto="abierto" :cerrar-afuera="cerrable" :cerrar-con-escape="cerrable" @cerrar="cerrar">
    <section class="caja" :class="ancho" tabindex="-1" role="dialog" aria-modal="true" :aria-labelledby="`${id}-t`">
      <header>
        <div class="titulos">
          <h2 :id="`${id}-t`">{{ titulo }}</h2>
          <slot name="cabecera" />
        </div>
        <button v-if="cerrable" type="button" class="icono" aria-label="Cerrar" title="Cerrar" @click="cerrar"><Icono nombre="cerrar" /></button>
      </header>
      <div class="capa-cuerpo"><slot /></div>
      <footer v-if="$slots.acciones"><slot name="acciones" :cerrar="cerrar" /></footer>
    </section>
  </Overlay>
</template>

<style scoped>
.caja { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; width: 100%; max-height: calc(100dvh - 32px); background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-lg); box-shadow: var(--sombra-2); }
.caja:focus { outline: none; }
.chico { max-width: 400px; }
.medio { max-width: 560px; }
.grande { max-width: 800px; }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px 12px; }
.titulos { display: grid; gap: 6px; justify-items: start; min-width: 0; }
h2 { margin: 0; font-size: 1.1rem; line-height: 1.3; }
.capa-cuerpo { overflow-y: auto; padding: 4px 20px 18px; }
footer { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--borde); }
@media (max-width: 560px) {
  header { padding: 16px 16px 10px; }
  .capa-cuerpo { padding: 4px 16px 16px; }
  footer { padding: 12px 16px; }
}
</style>
