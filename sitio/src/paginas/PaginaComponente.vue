<script setup>
import { computed } from 'vue';
import Demo from '../componentes/Demo.vue';
import TablaApi from '../componentes/TablaApi.vue';
import { COMPONENTES } from '../datos/componentes.js';
import { demosDe } from '../demos/index.js';

const props = defineProps({ id: { type: String, required: true } });
const c = computed(() => COMPONENTES[props.id]);
const demos = computed(() => demosDe(props.id).map((d) => ({ ...d, titulo: c.value.demos[d.archivo]?.[0] || d.archivo, descripcion: c.value.demos[d.archivo]?.[1] || '' })));
</script>

<template>
  <article class="doc">
    <p class="miga">{{ c.grupo === 'Gráficos' ? 'Gráficos' : `Componentes · ${c.grupo}` }}</p>
    <h1>{{ c.titulo }}</h1>
    <p class="lead">{{ c.desc }}</p>
    <p class="origen">Fuente: <code>{{ c.origen }}</code></p>

    <Demo v-for="d in demos" :id="`demo-${d.archivo}`" :key="d.archivo" :titulo="d.titulo" :descripcion="d.descripcion" :componente="d.componente" :fuente="d.fuente" :ancha="c.demoAncha" />

    <section v-if="c.props">
      <h2 id="props">{{ c.tituloProps || 'Props' }}</h2>
      <TablaApi :columnas="['Nombre', 'Tipo', 'Por defecto', 'Descripción']" :filas="c.props" />
    </section>
    <section v-if="c.extra">
      <h2 id="extra">{{ c.extra.titulo }}</h2>
      <TablaApi :columnas="c.extra.columnas" :filas="c.extra.filas" />
    </section>
    <section v-if="c.eventos">
      <h2 id="eventos">Eventos</h2>
      <TablaApi :columnas="['Evento', 'Cuándo']" :filas="c.eventos" />
    </section>
    <section v-if="c.slots">
      <h2 id="slots">Slots</h2>
      <TablaApi :columnas="['Slot', 'Contenido']" :filas="c.slots" />
    </section>
    <section v-if="c.clases">
      <h2 id="clases">Clases</h2>
      <TablaApi :columnas="['Clase', 'Efecto']" :filas="c.clases" />
    </section>
  </article>
</template>
