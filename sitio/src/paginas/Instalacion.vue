<script setup>
import Codigo from '../componentes/Codigo.vue';
</script>

<template>
  <article class="doc">
    <p class="miga">Empezar</p>
    <h1>Instalación</h1>
    <p class="lead">La librería se instala desde el repo. Necesita Vue 3.5 y un bundler que entienda archivos .vue: Vite con @vitejs/plugin-vue, o Astro con @astrojs/vue.</p>

    <section>
      <h2 id="instalar">1. Instalar</h2>
      <Codigo suelto codigo="npm install github:Ferjapolisgp/palo-ui-system#v1.1.0
// mientras se desarrolla la librería, desde una carpeta hermana:
npm install ../palo-ui-system" />
      <p class="sub">Si la app y la librería están en carpetas hermanas, agregá <code>resolve: { dedupe: ['vue'] }</code> en la configuración de Vite para que usen el mismo Vue.</p>
    </section>

    <section>
      <h2 id="estilos">2. Cargar estilos</h2>
      <p>Una vez, en el punto de entrada. Trae tokens, fuentes y estilos base.</p>
      <Codigo suelto codigo="import 'palo-ui-system/css';" />
      <p class="sub">Sin Vue también sirve: enlazá <code>css/palo-ui-system.css</code> y dejá la carpeta <code>fonts/</code> junto a <code>css/</code>.</p>
    </section>

    <section>
      <h2 id="usar">3. Usar componentes</h2>
      <Codigo suelto codigo="import { BarraLateral, BarraHerramientas, Indicador, GraficoLinea } from 'palo-ui-system';" />
      <p class="sub">Para las notificaciones, montá <code>&lt;Notificaciones /&gt;</code> una vez en la raíz y llamá a <code>notificar()</code> desde donde haga falta.</p>
    </section>

    <section>
      <h2 id="tema">4. Tema</h2>
      <p>Sigue al sistema operativo. Para forzarlo, <code>aplicarTema()</code> pone <code>data-theme</code> en <code>&lt;html&gt;</code> y lo recuerda en el navegador.</p>
      <Codigo suelto codigo="import { aplicarTema } from 'palo-ui-system';

aplicarTema('claro'); // 'claro' | 'oscuro' | 'sistema'" />
    </section>
  </article>
</template>
