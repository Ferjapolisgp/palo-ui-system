<script setup>
import { ref } from 'vue';
import Icono from './Icono.vue';

// Ficha de datos clave-valor: la cabecera de una solicitud, los datos de una persona.
// items: [{ termino, valor, clave?, mono?, copiable?, ancho? }]. Un valor vacío se muestra como «—».
// Para un valor con formato (una etiqueta, un enlace) se usa el slot con el nombre de su clave.
const props = defineProps({
  items: { type: Array, required: true },
  columnas: { type: Number, default: 1 }, // 1 a 3; en pantallas chicas, siempre 1
  etiquetaArriba: Boolean,
});
const vacio = (v) => v === undefined || v === null || v === '';
const copiado = ref(null);
let espera;
async function copiar(item) {
  try {
    await navigator.clipboard.writeText(String(item.valor));
    copiado.value = item.termino;
    clearTimeout(espera);
    espera = setTimeout(() => (copiado.value = null), 1500);
  } catch { /* sin permiso de portapapeles: el valor se puede seleccionar a mano */ }
}
</script>

<template>
  <div class="descriptions">
    <dl class="desc-lista" :class="{ arriba: etiquetaArriba }" :style="{ '--columnas': Math.min(3, Math.max(1, columnas)) }">
      <div v-for="item in items" :key="item.clave ?? item.termino" class="item" :style="item.ancho ? { gridColumn: `span ${item.ancho}` } : null">
        <dt>{{ item.termino }}</dt>
        <dd :class="{ mono: item.mono, vacio: vacio(item.valor) && !$slots[item.clave] }">
          <slot :name="item.clave ?? '-'" :item="item">{{ vacio(item.valor) ? '—' : item.valor }}</slot>
          <button v-if="item.copiable && !vacio(item.valor)" type="button" class="copiar" :aria-label="`Copiar ${item.termino}`"
                  :title="copiado === item.termino ? 'Copiado' : 'Copiar'" @click="copiar(item)">
            <Icono :nombre="copiado === item.termino ? 'ok' : 'copiar'" :tam="14" />
          </button>
        </dd>
      </div>
      <span class="oculto" aria-live="polite">{{ copiado ? `${copiado} copiado` : '' }}</span>
    </dl>
  </div>
</template>

<style scoped>
/* Las columnas dependen del lugar que tiene la ficha, no de la pantalla: dentro de un panel angosto va en una. */
.descriptions { container-type: inline-size; }
.desc-lista { display: grid; grid-template-columns: repeat(var(--columnas), minmax(0, 1fr)); gap: 0 28px; margin: 0; }
.item { display: grid; grid-template-columns: minmax(96px, 40%) minmax(0, 1fr); gap: 12px; align-items: baseline; padding: 9px 0; border-bottom: 1px solid var(--borde); min-width: 0; }
.arriba .item { grid-template-columns: minmax(0, 1fr); gap: 4px; border-bottom: 0; }
dt { color: var(--sub); font-size: .84rem; }
.arriba dt { font: 600 .64rem var(--mono); letter-spacing: .1em; text-transform: uppercase; }
dd { display: flex; align-items: center; gap: 6px; min-width: 0; margin: 0; font-size: .9rem; overflow-wrap: anywhere; }
dd.mono { font: 600 .84rem var(--mono); overflow-wrap: normal; }
dd.vacio { color: var(--tenue); }
.copiar { display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; flex: none; border-color: transparent; background: none; color: var(--sub); }
.copiar:hover { border-color: var(--borde-fuerte); color: var(--txt); }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@container (max-width: 560px) {
  .desc-lista:not(.arriba) { grid-template-columns: minmax(0, 1fr); }
  .desc-lista:not(.arriba) .item { grid-column: auto !important; }
}
@container (max-width: 360px) {
  .desc-lista { grid-template-columns: minmax(0, 1fr); }
  .item { grid-column: auto !important; }
}
</style>
