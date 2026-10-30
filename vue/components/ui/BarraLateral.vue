<script setup>
import Icono from './Icono.vue';
import Marca from './Marca.vue';

// Navegación principal de la app: grupos con ítems, contadores y la persona al pie. Se colapsa a íconos.
// grupos: [{ titulo, items: [{ texto, icono, ruta?, valor?, contador?, tono?, atajo? }] }]  (atajo: texto de la tecla, p. ej. «⌘ N»)
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
          <Icono v-if="it.icono" :nombre="it.icono" :tam="colapsada ? 24 : 18" />
          <span class="texto">{{ it.texto }}</span>
          <kbd v-if="it.atajo && !colapsada" class="atajo">{{ it.atajo }}</kbd>
          <span v-if="it.contador != null" class="contador" :class="it.tono && `tono-${it.tono}`">{{ typeof it.contador === 'number' ? it.contador.toLocaleString('es-AR') : it.contador }}</span>
        </component>
      </div>
    </nav>
    <div v-if="$slots.pie" class="pie"><slot name="pie" :colapsada="colapsada" /></div>
  </aside>
</template>

<style scoped>
.lat { --marco: var(--panel); display: flex; flex-direction: column; gap: 16px; padding: 14px 10px; min-width: 0; width: 232px; background: var(--panel); border-right: 1px solid var(--borde); }
.lat.colapsada { width: 62px; padding: 0 0 14px; }
.colapsada .grupos, .colapsada .pie { padding-inline: 6px; }
.colapsada .pie { display: flex; justify-content: center; }
.cab { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 0 2px; min-width: 0; }
.colapsada .cab { flex-direction: column; gap: 12px; align-items: stretch; padding: 0; }
.colapsada .cab :deep(.marca) { width: 100%; }
.colapsada .cab :deep(.ico) { width: 100%; height: auto; aspect-ratio: 1; }
.colapsada .cab :deep(.ico)::before, .colapsada .cab :deep(.ico)::after { display: none; }
.colapsada .plegar { align-self: center; }
.plegar { width: 28px; height: 28px; border-color: transparent; background: none; }
.plegar:hover { border-color: transparent; background: var(--borde-fuerte); }
.grupos { display: grid; gap: 14px; }
.grupo { display: grid; gap: 2px; }
.grupo p { margin: 0; padding: 0 10px 4px; font: 600 .6rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--tenue); }
.item { --esq: 7px; position: relative; display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: 0; border-radius: 0; background: none; color: var(--sub); font-weight: 400; font-size: .86rem; text-align: left; text-decoration: none; white-space: nowrap; cursor: pointer; transition: background .12s, color .12s; }
.item:hover { background: color-mix(in srgb, var(--txt) 5%, transparent); color: var(--txt); }
/* Activo: tinte suave y esquinas de encuadre */
.item.on { background: color-mix(in srgb, var(--txt) 7%, transparent); color: var(--txt); font-weight: 500; }
.item.on::after { content: ""; position: absolute; inset: 0; pointer-events: none; --l: linear-gradient(var(--senal), var(--senal));
  background: var(--l) left top / var(--esq) 1px no-repeat, var(--l) left top / 1px var(--esq) no-repeat,
    var(--l) right top / var(--esq) 1px no-repeat, var(--l) right top / 1px var(--esq) no-repeat,
    var(--l) left bottom / var(--esq) 1px no-repeat, var(--l) left bottom / 1px var(--esq) no-repeat,
    var(--l) right bottom / var(--esq) 1px no-repeat, var(--l) right bottom / 1px var(--esq) no-repeat; }
.item.on .icono-svg { color: var(--senal); }
.texto { overflow: hidden; text-overflow: ellipsis; }
.contador { --c: var(--sub); margin-left: auto; padding: 2px 8px; border-radius: var(--r-sm); background: color-mix(in srgb, var(--c) 16%, transparent); font: 600 .72rem/1.3 var(--ui); color: color-mix(in srgb, var(--c) 80%, var(--txt)); }
.contador.tono-aviso { --c: var(--aviso); }
.contador.tono-error { --c: var(--error); }
.colapsada .grupo p, .colapsada .texto, .colapsada .contador { display: none; }
.colapsada .item { justify-content: center; padding: 10px 0; }
.pie { margin-top: auto; padding: 12px 4px 0; border-top: 1px solid var(--borde); min-width: 0; }
</style>
