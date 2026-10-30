import { createRouter, createWebHashHistory } from 'vue-router';
import Inicio from './paginas/Inicio.vue';
import Instalacion from './paginas/Instalacion.vue';
import MarcaPagina from './paginas/MarcaPagina.vue';
import Color from './paginas/Color.vue';
import Tipografia from './paginas/Tipografia.vue';
import Reglas from './paginas/Reglas.vue';
import GuiaGraficos from './paginas/GuiaGraficos.vue';
import PaginaComponente from './paginas/PaginaComponente.vue';
import { COMPONENTES } from './datos/componentes.js';

// Rutas con # para que el sitio funcione en cualquier hosting estático, sin configurar el servidor.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Inicio },
    { path: '/instalacion', component: Instalacion },
    { path: '/marca', component: MarcaPagina },
    { path: '/color', component: Color },
    { path: '/tipografia', component: Tipografia },
    { path: '/reglas', component: Reglas },
    { path: '/graficos', component: GuiaGraficos },
    { path: '/componentes/:id', component: PaginaComponente, props: true, beforeEnter: (to) => (COMPONENTES[to.params.id] ? true : '/') },
    { path: '/:resto(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
