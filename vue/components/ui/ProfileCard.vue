<script setup>
import Avatar from './Avatar.vue';
import Icono from './Icono.vue';
import Tarjeta from './Tarjeta.vue';

// Tarjeta de una persona: avatar, nombre, rol, estado y datos de contacto. Se arma sobre Tarjeta, así acepta
// sus mismas props (variante, interactiva, seleccionada, cargando…) y eventos.
// contactos: [{ icono, texto, copiable? }]; con `href` el dato es un enlace (mailto:, tel:).
defineProps({
  nombre: { type: String, required: true },
  rol: String,
  estado: Object, // { texto, tono } → etiqueta junto al nombre
  contactos: { type: Array, default: () => [] },
  tam: { type: Number, default: 48 },
});
</script>

<template>
  <Tarjeta :titulo="nombre" :subtitulo="rol">
    <template #extra><span v-if="estado" class="tag" :class="estado.tono">{{ estado.texto }}</span></template>
    <div class="cuerpo-perfil">
      <Avatar :nombre="nombre" :tam="tam" class="foto" />
      <slot>
        <ul v-if="contactos.length" class="contactos">
          <li v-for="c in contactos" :key="c.texto">
            <Icono v-if="c.icono" :nombre="c.icono" :tam="14" />
            <a v-if="c.href" :href="c.href">{{ c.texto }}</a><span v-else>{{ c.texto }}</span>
          </li>
        </ul>
      </slot>
    </div>
    <template v-if="$slots.acciones" #acciones><slot name="acciones" /></template>
  </Tarjeta>
</template>

<style scoped>
.cuerpo-perfil { display: flex; gap: 14px; align-items: flex-start; }
.foto { flex: none; }
.contactos { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; min-width: 0; font-size: .86rem; }
.contactos li { display: flex; align-items: center; gap: 8px; min-width: 0; overflow-wrap: anywhere; }
.contactos .icono-svg { flex: none; color: var(--sub); }
.contactos a { color: var(--txt); }
</style>
