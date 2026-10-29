<script setup>
import Skeleton from './Skeleton.vue';

// Contenedor con cabecera, cuerpo y acciones: la ficha de una persona, un documento o una solicitud.
// Un <dl> en el cuerpo se dibuja como lista de datos (término a la izquierda, valor a la derecha).
// Con `interactiva` toda la tarjeta se puede tocar: el título es el botón (lo que lee un lector de pantalla y lo que
// recibe el foco) y se estira sobre la tarjeta; los botones de las acciones siguen funcionando por separado.
// El `tono` es solo un acento: el estado siempre va además escrito (una etiqueta en `extra`).
defineProps({
  titulo: String,
  subtitulo: String,
  variante: { type: String, default: 'contorno' }, // 'contorno' | 'plana' | 'elevada'
  tono: String, // 'ok' | 'aviso' | 'error' | 'info'
  interactiva: Boolean,
  seleccionada: Boolean,
  cargando: Boolean,
  compacta: Boolean,
});
const emit = defineEmits(['abrir']);
</script>

<template>
  <section class="tarjeta" :class="[variante, tono && `tono-${tono}`, { interactiva, seleccionada, compacta }]" :aria-busy="cargando || undefined">
    <div v-if="$slots.media && !cargando" class="media"><slot name="media" /></div>
    <header v-if="titulo || $slots.extra">
      <div class="titulos">
        <template v-if="cargando"><Skeleton :lineas="1" :ancho="150" etiqueta="Cargando…" /></template>
        <button v-else-if="interactiva" type="button" class="titulo-boton" :aria-pressed="seleccionada || undefined" @click="emit('abrir')">{{ titulo }}</button>
        <b v-else>{{ titulo }}</b>
        <small v-if="subtitulo && !cargando">{{ subtitulo }}</small>
      </div>
      <slot v-if="!cargando" name="extra" />
    </header>
    <div class="tarjeta-cuerpo">
      <Skeleton v-if="cargando" :lineas="3" etiqueta="" />
      <slot v-else />
    </div>
    <footer v-if="$slots.acciones && !cargando"><slot name="acciones" /></footer>
  </section>
</template>

<style scoped>
.tarjeta { position: relative; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); min-width: 0; overflow: hidden; }
.plana { background: var(--panel-2); border-color: transparent; }
.elevada { border-color: var(--borde); box-shadow: var(--sombra-1); }
.tono-ok, .tono-aviso, .tono-error, .tono-info { border-left: 3px solid var(--acento-tono); }
.tono-ok { --acento-tono: var(--ok); }
.tono-aviso { --acento-tono: var(--aviso); }
.tono-error { --acento-tono: var(--error); }
.tono-info { --acento-tono: var(--info); }
.media { border-bottom: 1px solid var(--borde); }
.media :slotted(img) { display: block; width: 100%; height: auto; }
header { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--borde); }
.titulos { display: grid; gap: 2px; min-width: 0; }
header b, .titulo-boton { display: block; font: inherit; font-weight: 700; }
header small { font: 600 .72rem var(--mono); color: var(--sub); }
.tarjeta-cuerpo { padding: 12px 14px; }
.tarjeta-cuerpo :slotted(dl) { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-size: .86rem; }
.tarjeta-cuerpo :slotted(dt) { color: var(--sub); }
.tarjeta-cuerpo :slotted(dd) { margin: 0; text-align: right; font: 500 .82rem var(--mono); }
footer { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--borde); }
.compacta header { padding: 8px 12px; }
.compacta .tarjeta-cuerpo { padding: 8px 12px; }
.compacta footer { padding: 8px 12px; }

/* Interactiva: el título se estira sobre toda la tarjeta; lo demás clicable va por encima. */
.interactiva { transition: border-color .15s, box-shadow .15s; }
.interactiva:hover { border-color: var(--borde-fuerte); }
.interactiva:has(.titulo-boton:focus-visible) { outline: 2px solid var(--senal); outline-offset: 2px; }
.titulo-boton { padding: 0; border: 0; background: none; text-align: left; cursor: pointer; }
.titulo-boton:hover { border: 0; }
.titulo-boton:focus-visible { outline: none; }
.titulo-boton::after { content: ""; position: absolute; inset: 0; }
.interactiva footer :slotted(button), .interactiva footer :slotted(a), .interactiva header :slotted(*) { position: relative; z-index: 1; }
.seleccionada { border-color: var(--senal); box-shadow: 0 0 0 1px var(--senal); }
@media (prefers-reduced-motion: reduce) { .interactiva { transition: none; } }
</style>
