<script setup>
// Contenedor con cabecera, cuerpo y acciones: la ficha de una persona, un documento o una solicitud.
// Un <dl> en el cuerpo se dibuja como lista de datos (término a la izquierda, valor a la derecha).
defineProps({ titulo: String, subtitulo: String });
</script>

<template>
  <section class="tarjeta">
    <header v-if="titulo || $slots.extra">
      <div><b>{{ titulo }}</b><small v-if="subtitulo">{{ subtitulo }}</small></div>
      <slot name="extra" />
    </header>
    <div class="tarjeta-cuerpo"><slot /></div>
    <footer v-if="$slots.acciones"><slot name="acciones" /></footer>
  </section>
</template>

<style scoped>
.tarjeta { background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); min-width: 0; }
header { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--borde); }
header b { display: block; }
header small { font: 600 .72rem var(--mono); color: var(--sub); }
.tarjeta-cuerpo { padding: 12px 14px; }
.tarjeta-cuerpo :slotted(dl) { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-size: .86rem; }
.tarjeta-cuerpo :slotted(dt) { color: var(--sub); }
.tarjeta-cuerpo :slotted(dd) { margin: 0; text-align: right; font: 500 .82rem var(--mono); }
footer { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--borde); }
</style>
