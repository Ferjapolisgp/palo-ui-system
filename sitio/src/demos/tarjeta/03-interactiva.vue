<script setup>
import { computed, ref } from 'vue';
import { Tarjeta, notificar } from 'palo-ui-system';
import { bandeja } from '../../datos/ejemplo.js';

const lista = bandeja.slice(0, 4);
const elegida = ref(null);
const actual = computed(() => lista.find((s) => s.codigo === elegida.value));
function asignar(s) {
  notificar({ titulo: `${s.codigo} asignada a vos`, detalle: 'Datos de ejemplo: no se asignó nada.' });
}
</script>

<template>
  <div class="todo">
    <div class="grilla" role="group" aria-label="Solicitudes">
      <Tarjeta v-for="s in lista" :key="s.codigo" interactiva :seleccionada="elegida === s.codigo" :titulo="s.asunto" :subtitulo="s.codigo" :tono="s.tono"
               @abrir="elegida = elegida === s.codigo ? null : s.codigo">
        <template #extra><span class="tag" :class="s.tono">{{ s.estado }}</span></template>
        <span class="sub">{{ s.solicitante }} · {{ s.area }} · {{ s.horas }} h</span>
        <template #acciones><button type="button" @click="asignar(s)">Asignarme</button></template>
      </Tarjeta>
    </div>
    <p class="sub" aria-live="polite">{{ actual ? `Elegida: ${actual.codigo}` : 'Ninguna elegida. Tocá una tarjeta o llegá con Tab y usá Enter.' }}</p>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 12px; width: 100%; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; align-items: start; }
p { margin: 0; font-size: .86rem; }
</style>
