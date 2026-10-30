<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Marca } from 'palo-ui-system';
import Vitrina from '../componentes/Vitrina.vue';
import { COMPONENTES } from '../datos/componentes.js';

const copiado = ref(false);
async function copiar() {
  try { await navigator.clipboard.writeText('npm install ../palo-ui-system'); copiado.value = true; setTimeout(() => { copiado.value = false; }, 1600); } catch { /* el comando queda visible para copiarlo a mano */ }
}
const cantidad = Object.keys(COMPONENTES).length;
</script>

<template>
  <article class="doc">
    <section class="hero">
      <p class="etiqueta-seccion">Serie 01 · Sistema visual · v0.1.0</p>
      <div class="titulo"><Marca solo-icono grande class="logo" /><h1 class="calca">Palo UI</h1></div>
      <p class="lead">El sistema visual de las herramientas internas de Palo (Pay, Docs, Onboarding, la Ticketera): tokens, estilos y componentes Vue 3 para armar backoffices claros, en oscuro y en claro, sin escribir un color a mano.</p>
      <div class="acciones">
        <RouterLink to="/instalacion" class="boton primario">Empezar</RouterLink>
        <RouterLink to="/componentes/boton" class="boton">Ver componentes</RouterLink>
        <span class="instalar"><code>npm install ../palo-ui-system</code><button type="button" @click="copiar">{{ copiado ? 'Copiado' : 'Copiar' }}</button></span>
      </div>
    </section>

    <section>
      <h2 id="vitrina">Vitrina</h2>
      <p class="sub">Una bandeja de solicitudes armada solo con componentes de la librería. Marcá filas, filtrá, colapsá la barra lateral o cambiá de página. Datos de ejemplo.</p>
      <!-- La vitrina recorta su contenido: el marco de corte va en un contenedor de afuera. -->
      <div class="marco-corte vitrina-marco"><Vitrina /></div>
    </section>

    <section>
      <h2 id="por-que">Por qué así</h2>
      <div class="rasgos">
        <div class="marco-corte esquinas"><b>Solo tokens</b><p>Cada color, radio y sombra sale de una variable. Cambiar la marca es cambiar <code>tokens.css</code>, no los componentes.</p></div>
        <div class="marco-corte esquinas"><b>Oscuro y claro</b><p>Oscuro para la jornada larga, claro cuando hay mucha luz. Los dos temas se mantienen en sincronía.</p></div>
        <div class="marco-corte esquinas"><b>Hecho para operar</b><p>Códigos estampados, estados con texto y forma, y una sola señal para lo que se puede tocar.</p></div>
      </div>
      <p class="sub">{{ cantidad }} componentes y gráficos documentados, cada uno con demos vivas, código y API.</p>
    </section>
  </article>
</template>

<style scoped>
.hero { display: grid; gap: 20px; padding-top: 8px; }
.titulo { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.titulo h1 { font-size: clamp(2rem, 5vw, 3rem); }
.logo { --marco: var(--bg); }
.logo :deep(.ico) { width: 64px; height: 64px; }
.hero .lead { font-size: 1.12rem; }
.acciones { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.boton { display: inline-flex; align-items: center; height: 40px; padding: 0 18px; border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); background: var(--panel); color: var(--txt); font-weight: 600; text-decoration: none; }
.boton:hover { border-color: var(--txt); }
.boton.primario { background: var(--senal); border-color: var(--senal); color: var(--senal-txt); font-weight: 700; }
.instalar { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 6px 0 12px; border: 1px solid var(--borde); border-radius: var(--r-md); background: var(--panel); }
.instalar code { padding: 0; border: 0; background: none; }
.instalar button { height: 28px; padding: 0 8px; font-size: .72rem; font-weight: 600; }
.vitrina-marco { margin: 22px; }
.rasgos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; padding: 22px; }
.rasgos > div { display: grid; gap: 6px; align-content: start; padding: 16px; border: 1px solid var(--borde); border-radius: var(--r-lg); }
.rasgos p { color: var(--sub); font-size: .86rem; }
@media (max-width: 860px) { .rasgos { grid-template-columns: minmax(0, 1fr); } }
</style>
