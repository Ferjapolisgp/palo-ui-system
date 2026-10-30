<script setup>
import { ref } from 'vue';
import { Icono } from 'palo-ui-system';
import Codigo from './Codigo.vue';

// Una demo: título y explicación arriba; el componente vivo a la izquierda y su código a la derecha.
// Cuando no hay ancho, el código pasa abajo y se abre a pedido.
const props = defineProps({ id: String, titulo: String, descripcion: String, componente: Object, fuente: String });
const verCodigo = ref(false);
const copiado = ref('');
async function copiar() {
  try { await navigator.clipboard.writeText(props.fuente); copiado.value = 'Copiado'; }
  catch { copiado.value = 'No se pudo copiar'; }
  setTimeout(() => { copiado.value = ''; }, 1600);
}
</script>

<template>
  <section class="demo">
    <div class="info">
      <h2 :id="id">{{ titulo }}</h2>
      <p>{{ descripcion }}</p>
    </div>
    <div class="marco" :class="{ 'con-codigo': verCodigo }">
      <div class="vista"><component :is="componente" /></div>
      <div class="codigo">
        <div class="barra">
          <span>Vue</span>
          <button type="button" class="alternar" :aria-expanded="verCodigo" @click="verCodigo = !verCodigo"><Icono nombre="codigo" :tam="15" />{{ verCodigo ? 'Ocultar código' : 'Ver código' }}</button>
          <button type="button" @click="copiar"><Icono nombre="copiar" :tam="15" />{{ copiado || 'Copiar' }}</button>
        </div>
        <Codigo :codigo="fuente" class="fuente" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo { min-width: 0; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); container-type: inline-size; }
.info { display: grid; gap: 4px; padding: 14px 18px; border-bottom: 1px solid var(--borde); }
.info h2 { margin: 0; font-size: 1rem; }
.info p { margin: 0; color: var(--sub); font-size: .88rem; }
.marco { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.vista { position: relative; display: flex; flex-wrap: wrap; align-items: center; align-content: center; gap: 12px; min-width: 0; padding: 28px 24px; background: var(--bg); border-radius: 0 0 0 var(--r-lg); }
.codigo { display: flex; flex-direction: column; min-width: 0; background: var(--panel-2); border-left: 1px solid var(--borde); border-radius: 0 0 var(--r-lg) 0; }
.barra { display: flex; align-items: center; gap: 8px; padding: 8px 10px 8px 18px; border-bottom: 1px solid var(--borde); }
.barra span { flex: 1; font: 600 .66rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--tenue); }
.barra button { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; font-size: .78rem; }
.alternar { display: none !important; }
.fuente { flex: 1; margin: 0; max-height: 560px; padding: 16px 18px; overflow: auto; font: 500 .8rem/1.7 var(--mono); }

/* Sin ancho para dos columnas: el código abajo, plegado. */
@container (max-width: 760px) {
  .marco { grid-template-columns: minmax(0, 1fr); }
  .vista { border-radius: 0; }
  .codigo { border-left: 0; border-top: 1px solid var(--borde); border-radius: 0 0 var(--r-lg) var(--r-lg); }
  .alternar { display: inline-flex !important; }
  .marco:not(.con-codigo) .fuente { display: none; }
  .marco:not(.con-codigo) .barra { border-bottom: 0; }
}
@media (max-width: 600px) { .vista { padding: 20px 14px; } }
</style>
