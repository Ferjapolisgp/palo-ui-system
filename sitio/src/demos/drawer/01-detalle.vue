<script setup>
import { ref } from 'vue';
import { Confirmar, Desplegable, Drawer, notificar } from 'palo-ui-system';
import { solicitudes } from '../../datos/ejemplo.js';

const actual = ref(null);
const abierto = ref(false);
const responsable = ref('');
const confirmar = ref(false);
function abrir(s) {
  actual.value = s;
  abierto.value = true;
}
function cerrarSolicitud() {
  confirmar.value = false;
  abierto.value = false;
  notificar({ titulo: `${actual.value.codigo} cerrada`, detalle: 'Datos de ejemplo: no se cerró nada.' });
}
</script>

<template>
  <div class="tabla-simple">
    <table>
      <thead><tr><th>Código</th><th>Asunto</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="s in solicitudes" :key="s.codigo">
          <td><button type="button" class="enlace" @click="abrir(s)">{{ s.codigo }}</button></td>
          <td>{{ s.asunto }}</td>
          <td><span class="tag" :class="s.tono">{{ s.estado }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Drawer v-model:abierto="abierto" :titulo="actual?.asunto ?? ''">
    <template #cabecera>
      <div class="fila"><span class="cod">{{ actual?.codigo }}</span><span class="tag" :class="actual?.tono">{{ actual?.estado }}</span></div>
    </template>
    <dl v-if="actual">
      <dt>Solicitante</dt><dd>{{ actual.solicitante }}</dd>
      <dt>Área</dt><dd>{{ actual.area }}</dd>
      <dt>Abierta hace</dt><dd>{{ actual.horas }} h</dd>
      <dt>Responsable</dt>
      <dd><Desplegable v-model="responsable" :opciones="[{ valor: '', texto: 'Sin asignar' }, { valor: 'ana', texto: 'Ana Ruiz' }, { valor: 'lucas', texto: 'Lucas Gómez' }]" /></dd>
    </dl>
    <template #acciones="{ cerrar }">
      <button type="button" class="peligro" @click="confirmar = true">Cerrar solicitud</button>
      <button type="button" @click="cerrar">Volver a la lista</button>
    </template>
  </Drawer>
  <Confirmar v-if="confirmar" peligro :titulo="`¿Cerrar ${actual.codigo}?`" texto="El solicitante recibe un aviso. Se puede reabrir durante 7 días."
             boton="Cerrar solicitud" @confirmar="cerrarSolicitud" @cancelar="confirmar = false" />
</template>

<style scoped>
.tabla-simple { width: 100%; }
.enlace { padding: 0; border: 0; background: none; color: var(--txt); font: 700 .8rem var(--mono); text-decoration: underline; text-underline-offset: 3px; }
.enlace:hover { color: var(--senal); }
.fila { display: flex; align-items: center; gap: 10px; }
.cod { font: 700 .8rem var(--mono); color: var(--sub); }
dl { display: grid; grid-template-columns: auto 1fr; gap: 14px 20px; align-items: center; margin: 0; }
dt { color: var(--sub); font-size: .86rem; }
dd { margin: 0; }
</style>
