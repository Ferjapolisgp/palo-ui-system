<script setup>
import { iniciales } from '../../lib/formato.js';
import Icono from './Icono.vue';
import Tarjeta from './Tarjeta.vue';

// Ficha de una persona: portada, nombre con verificación, descripción, tres o cuatro cifras y una acción al pie.
// Se arma sobre Tarjeta, así acepta sus mismas props (variante, tono, interactiva, seleccionada, cargando…) y eventos.
// datos: [{ valor, etiqueta, icono? }] → cifras en fila separadas por líneas.
// contactos: [{ icono, texto }]; con `href` el dato es un enlace (mailto:, tel:).
// Sin `imagen`, la portada muestra las iniciales.
defineProps({
  nombre: { type: String, required: true },
  rol: String,
  descripcion: String,
  imagen: String,
  verificado: Boolean,
  estado: Object, // { texto, tono } → etiqueta junto al nombre
  datos: { type: Array, default: () => [] },
  contactos: { type: Array, default: () => [] },
});
</script>

<template>
  <Tarjeta class="perfil">
    <template #media>
      <div class="portada">
        <img v-if="imagen" :src="imagen" :alt="nombre" />
        <span v-else class="iniciales" aria-hidden="true">{{ iniciales(nombre) }}</span>
        <div v-if="$slots['media-accion']" class="media-accion"><slot name="media-accion" /></div>
      </div>
    </template>
    <div class="ficha">
      <div class="nombre">
        <b>{{ nombre }}</b>
        <Icono v-if="verificado" nombre="revisado" :tam="16" class="verificado" role="img" aria-label="Verificado" />
        <span v-if="estado" class="tag" :class="estado.tono">{{ estado.texto }}</span>
      </div>
      <small v-if="rol" class="rol">{{ rol }}</small>
      <p v-if="descripcion" class="desc">{{ descripcion }}</p>
      <dl v-if="datos.length" class="datos">
        <div v-for="d in datos" :key="d.etiqueta">
          <dt>{{ d.etiqueta }}</dt>
          <dd><Icono v-if="d.icono" :nombre="d.icono" :tam="14" />{{ d.valor }}</dd>
        </div>
      </dl>
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
.portada { position: relative; aspect-ratio: 1; background: var(--grafito); overflow: hidden; }
.portada img { display: block; width: 100%; height: 100%; object-fit: cover; }
.iniciales { position: absolute; inset: 0; display: grid; place-items: center; font: 700 3.2rem var(--mono); letter-spacing: .06em; color: color-mix(in srgb, var(--txt) 70%, transparent); }
.media-accion { position: absolute; top: 10px; right: 10px; }
.media-accion :slotted(button) { width: 36px; height: 36px; padding: 0; display: inline-grid; place-items: center; background: var(--panel); color: var(--txt); }
.ficha { display: grid; gap: 8px; }
.nombre { display: flex; align-items: center; gap: 8px; min-width: 0; }
.nombre b { font-size: 1.05rem; font-weight: 700; letter-spacing: -.01em; }
.verificado { flex: none; color: var(--info); }
.nombre .tag { margin-left: auto; }
.rol { font: 600 .72rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--sub); }
.desc { margin: 0; color: var(--sub); font-size: .86rem; }
/* Más específico que la regla de dl de Tarjeta, que arma dos columnas término/valor */
.perfil .ficha .datos { display: flex; gap: 0; margin: 4px 0 0; padding: 12px 0 2px; border-top: 1px solid var(--borde); font-size: inherit; }
.datos > div { flex: 1; display: grid; justify-items: center; gap: 2px; min-width: 0; }
.datos > div + div { border-left: 1px solid var(--borde); }
.datos dd { margin: 0; display: flex; align-items: center; gap: 6px; font: 700 1rem var(--ui); font-variant-numeric: tabular-nums; }
.datos dd .icono-svg { color: var(--sub); }
.datos dt { order: 1; font: 600 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); }
.contactos { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; min-width: 0; font-size: .86rem; }
.contactos li { display: flex; align-items: center; gap: 8px; min-width: 0; overflow-wrap: anywhere; }
.contactos .icono-svg { flex: none; color: var(--sub); }
.contactos a { color: var(--txt); }
/* La acción ocupa todo el ancho, sin línea sobre ella */
.perfil :deep(footer) { border-top: 0; padding-top: 0; }
.perfil :deep(footer > *) { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding-block: 10px; }
</style>
