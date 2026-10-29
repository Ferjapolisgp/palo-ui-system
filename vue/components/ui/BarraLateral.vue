<script setup>
import Icono from './Icono.vue';
import Marca from './Marca.vue';

// Navegación principal de la app: grupos con ítems, contadores y la persona al pie. Se colapsa a íconos.
// grupos: [{ titulo, items: [{ texto, icono, ruta?, valor?, contador?, tono? }] }]
// Con `enlace` (por ejemplo RouterLink) cada ítem con ruta se dibuja con ese componente; sin él, como <a href>.
const props = defineProps({
  grupos: { type: Array, default: () => [] },
  activo: String,
  colapsada: Boolean,
  producto: { type: String, default: '' },
  serie: { type: String, default: '' },
  enlace: [Object, String],
});
const emit = defineEmits(['update:colapsada', 'navegar']);

const esActivo = (it) => props.activo != null && (it.valor ?? it.ruta) === props.activo;
const etiqueta = (it) => (it.ruta ? (props.enlace || 'a') : 'button');
const atributos = (it) => (!it.ruta ? { type: 'button' } : props.enlace ? { to: it.ruta } : { href: it.ruta });
</script>

<template>
  <aside class="lat" :class="{ colapsada }">
    <div class="cab">
      <slot name="cabecera"><Marca :producto="producto" :serie="serie" :solo-icono="colapsada" /></slot>
      <button type="button" class="icono plegar" :aria-expanded="!colapsada" :aria-label="colapsada ? 'Expandir barra lateral' : 'Colapsar barra lateral'"
              :title="colapsada ? 'Expandir' : 'Colapsar'" @click="emit('update:colapsada', !colapsada)">
        <Icono :nombre="colapsada ? 'derecha' : 'izquierda'" :tam="16" />
      </button>
    </div>
    <nav class="grupos">
      <div v-for="g in grupos" :key="g.titulo" class="grupo">
        <p v-if="g.titulo">{{ g.titulo }}</p>
        <component :is="etiqueta(it)" v-for="it in g.items" :key="it.texto" v-bind="atributos(it)" class="item" :class="{ on: esActivo(it) }"
                   :aria-current="esActivo(it) ? 'page' : undefined" :title="colapsada ? it.texto : undefined" @click="emit('navegar', it)">
          <Icono v-if="it.icono" :nombre="it.icono" />
          <span class="texto">{{ it.texto }}</span>
          <span v-if="it.contador != null" class="contador" :class="it.tono">{{ typeof it.contador === 'number' ? it.contador.toLocaleString('es-AR') : it.contador }}</span>
        </component>
      </div>
    </nav>
    <div v-if="$slots.pie" class="pie"><slot name="pie" :colapsada="colapsada" /></div>
  </aside>
</template>

<style scoped>
.lat { --marco: var(--panel); display: flex; flex-direction: column; gap: 16px; padding: 14px 10px; min-width: 0; width: 232px; background: var(--panel); border-right: 1px solid var(--borde); transition: width .2s; }
.lat.colapsada { width: 62px; }
.cab { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 0 2px; min-width: 0; }
.colapsada .cab { flex-direction: column; gap: 12px; }
.plegar { width: 28px; height: 28px; }
.grupos { display: grid; gap: 14px; }
.grupo { display: grid; gap: 2px; }
.grupo p { margin: 0; padding: 0 10px 4px; font: 600 .6rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--tenue); }
.item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px 10px; border: 0; border-radius: var(--r-md); background: none; color: var(--sub); font-weight: 500; font-size: .86rem; text-align: left; text-decoration: none; white-space: nowrap; cursor: pointer; }
.item:hover { background: var(--panel-2); color: var(--txt); }
.item.on { background: var(--panel-2); color: var(--txt); font-weight: 600; }
.item.on .icono-svg { color: var(--senal); }
.texto { overflow: hidden; text-overflow: ellipsis; }
.contador { margin-left: auto; padding: 1px 6px; border: 1px solid var(--borde-fuerte); border-radius: var(--r-sm); font: 700 .62rem var(--mono); color: var(--sub); }
.contador.aviso { border-color: var(--aviso); color: color-mix(in srgb, var(--aviso) 70%, var(--txt)); }
.contador.error { border-color: var(--error); color: color-mix(in srgb, var(--error) 70%, var(--txt)); }
.colapsada .grupo p, .colapsada .texto, .colapsada .contador { display: none; }
.colapsada .item { justify-content: center; padding: 8px 0; }
.pie { margin-top: auto; padding: 12px 4px 0; border-top: 1px solid var(--borde); min-width: 0; }
@media (prefers-reduced-motion: reduce) { .lat { transition: none; } }
</style>
