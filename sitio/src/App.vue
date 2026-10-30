<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { Icono, Marca, Notificaciones } from 'palo-ui-system';
import { NAVEGACION, PLANO } from './datos/navegacion.js';
import { usarModo, cambiarModo } from './usarModo.js';

const route = useRoute();
const router = useRouter();
const modo = usarModo();

// Buscador del menú: filtra por texto o grupo, sin acentos. Enter abre el primer resultado.
const busqueda = ref('');
const buscador = ref(null);
const plano = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const menu = computed(() => {
  const q = plano(busqueda.value.trim());
  return NAVEGACION.map(({ seccion, clave, grupos }) => ({
    seccion, clave,
    grupos: grupos.map(([g, items]) => [g, items.filter(([t]) => !q || plano(`${t} ${g} ${seccion}`).includes(q))]).filter(([, items]) => items.length),
  })).filter((s) => s.grupos.length);
});
function irPrimero() {
  const primero = menu.value[0]?.grupos[0]?.[1][0];
  if (primero) { router.push(primero[1]); busqueda.value = ''; buscador.value.blur(); }
}

const menuAbierto = ref(false);
watch(() => route.fullPath, () => { menuAbierto.value = false; });

// Sección de la barra superior según el grupo de la página actual.
const actual = computed(() => PLANO.findIndex((p) => p.ruta === route.path));
const seccion = computed(() => {
  const clave = PLANO[actual.value]?.clave;
  return route.path === '/marca' ? 'marca' : route.path === '/' ? '' : clave ?? 'componentes';
});

// Grupos plegables: arrancan cerrados salvo el de la página actual; lo que toca la persona manda.
// Con búsqueda se abre todo, y el grupo de la página actual nunca queda cerrado.
const plegado = ref({});
const llave = (s, g) => `${s}/${g}`;
const abierto = (s, g) => busqueda.value.trim() !== ''
  || (PLANO[actual.value]?.seccion === s && PLANO[actual.value]?.grupo === g)
  || plegado.value[llave(s, g)] === true;
const alternar = (s, g) => { plegado.value[llave(s, g)] = !abierto(s, g); };
const anterior = computed(() => PLANO[actual.value - 1]);
const siguiente = computed(() => PLANO[actual.value + 1]);

// Índice «En esta página»: los h2 con id del contenido.
const toc = ref([]);
watch(() => route.fullPath, async () => {
  await nextTick();
  toc.value = [...document.querySelectorAll('.contenido h2[id]')].map((h) => ({ id: h.id, texto: h.textContent }));
}, { immediate: true, flush: 'post' });
const ir = (id) => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

function tecla(e) {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); buscador.value?.focus(); }
  if (e.key === 'Escape') menuAbierto.value = false;
}
onMounted(() => document.addEventListener('keydown', tecla));
onBeforeUnmount(() => document.removeEventListener('keydown', tecla));
</script>

<template>
  <div :class="{ 'menu-abierto': menuAbierto }">
    <header class="top">
      <button type="button" class="icono menu-btn" :aria-expanded="menuAbierto" aria-label="Abrir menú" @click="menuAbierto = !menuAbierto"><Icono nombre="menu" /></button>
      <RouterLink to="/" class="top-logo" aria-label="Palo UI, inicio"><Marca producto="UI" serie="Sistema visual" /></RouterLink>
      <div class="buscador">
        <Icono nombre="buscar" :tam="16" />
        <input ref="buscador" v-model="busqueda" type="search" placeholder="Buscar componentes" aria-label="Buscar componentes" autocomplete="off"
               @keydown.enter="irPrimero" @focus="menuAbierto = true" @keydown.esc="busqueda = ''">
        <kbd>/</kbd>
      </div>
      <nav class="top-nav" aria-label="Secciones">
        <RouterLink to="/instalacion" :class="{ on: seccion === 'guia' }">Guía</RouterLink>
        <RouterLink to="/componentes/boton" :class="{ on: seccion === 'componentes' }">Componentes</RouterLink>
        <RouterLink to="/graficos" :class="{ on: seccion === 'graficos' }">Gráficos</RouterLink>
        <RouterLink to="/marca" :class="{ on: seccion === 'marca' }">Marca</RouterLink>
      </nav>
      <div class="top-der">
        <button type="button" class="icono" :aria-label="modo === 'oscuro' ? 'Pasar a tema claro' : 'Pasar a tema oscuro'" title="Cambiar tema" @click="cambiarModo">
          <Icono :nombre="modo === 'oscuro' ? 'sol' : 'luna'" />
        </button>
        <span class="tag version">v1.1.0</span>
      </div>
    </header>

    <div class="cuerpo">
      <aside class="nav-lat" aria-label="Documentación">
        <section v-for="s in menu" :key="s.clave" class="nav-seccion">
          <h6>{{ s.seccion }}</h6>
          <div v-for="[grupo, items] in s.grupos" :key="grupo" class="nav-grupo" :class="{ abierto: abierto(s.seccion, grupo) }">
            <button type="button" :aria-expanded="abierto(s.seccion, grupo)" @click="alternar(s.seccion, grupo)">
              <Icono nombre="derecha" :tam="14" /><span>{{ grupo }}</span><small>{{ items.length }}</small>
            </button>
            <div v-show="abierto(s.seccion, grupo)" class="nav-items">
              <RouterLink v-for="[texto, ruta] in items" :key="ruta" :to="ruta">{{ texto }}</RouterLink>
            </div>
          </div>
        </section>
        <p v-if="!menu.length" class="nav-vacio">Nada coincide con «{{ busqueda }}».</p>
      </aside>

      <main class="contenido" :class="{ ancho: route.path.startsWith('/componentes/') }">
        <RouterView :key="route.fullPath" />
        <nav v-if="actual >= 0" class="pasos" aria-label="Página anterior y siguiente">
          <RouterLink v-if="anterior" :to="anterior.ruta"><small>Anterior</small>{{ anterior.texto }}</RouterLink><span v-else></span>
          <RouterLink v-if="siguiente" :to="siguiente.ruta" class="sig"><small>Siguiente</small>{{ siguiente.texto }}</RouterLink>
        </nav>
      </main>

      <aside class="toc" aria-label="En esta página">
        <template v-if="toc.length">
          <p class="etiqueta-seccion">En esta página</p>
          <button v-for="t in toc" :key="t.id" type="button" @click="ir(t.id)">{{ t.texto }}</button>
        </template>
      </aside>
    </div>
    <Notificaciones />
  </div>
</template>
