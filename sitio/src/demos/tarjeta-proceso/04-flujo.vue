<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { TarjetaProceso } from 'palo-ui-system';

// Flujo simulado de 306 pasos (el peor caso de un escenario de pruebas: 300 altas + 6). La tarjeta solo muestra:
// el avance, la pausa y el corte los maneja la app (acá, con un temporizador). Los resultados son inventados.
const N = 306;
const fase = ref('reposo'); // reposo | corriendo | pausa | detenido | fin
const celdas = ref(Array.from({ length: N }, () => 'pend'));
const hechos = ref(0);
const resaltar = ref(null);
let timer = null;

const errores = computed(() => celdas.value.filter((c) => c === 'error').length);
const estado = computed(() => ({ reposo: 'cola', corriendo: 'curso', pausa: 'pausa', detenido: 'detenido', fin: errores.value ? 'aviso' : 'ok' })[fase.value]);
const etiqueta = computed(() => ({ reposo: '◷ Sin iniciar', corriendo: '● Corriendo', fin: errores.value ? '▲ Con errores' : '✓ Completado' })[fase.value]);

function paso() {
  celdas.value[hechos.value] = Math.random() < 0.97 ? 'ok' : 'error';
  hechos.value++;
  if (hechos.value >= N) { fase.value = 'fin'; return; }
  timer = setTimeout(paso, 15 + Math.random() * 65);
}
function iniciar() { if (fase.value === 'reposo' || fase.value === 'fin' || fase.value === 'detenido') reiniciar(); fase.value = 'corriendo'; timer = setTimeout(paso, 200); }
function frenar(a) { clearTimeout(timer); fase.value = a; }
function reiniciar() { clearTimeout(timer); celdas.value = Array.from({ length: N }, () => 'pend'); hechos.value = 0; resaltar.value = null; fase.value = 'reposo'; }
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="uno">
    <TarjetaProceso codigo="PR-0433" titulo="Prueba de carga — 300 altas en lote" :estado="estado" :etiqueta-estado="etiqueta"
                    :celdas="celdas" celdas-mini :resaltar="resaltar" :nombres-celdas="{ ok: 'Correctos', error: 'Con error', pend: 'Pendientes' }">
      <template #pie><b>{{ hechos }}</b>/<b>{{ N }}</b> pasos · <b>{{ errores }}</b> con error</template>
      <template #acciones>
        <template v-if="fase === 'reposo'"><button type="button" @click="iniciar">Iniciar flujo</button></template>
        <template v-else-if="fase === 'corriendo'"><button type="button" @click="frenar('pausa')">Pausar</button><button type="button" @click="frenar('detenido')">Detener</button></template>
        <template v-else-if="fase === 'pausa'"><button type="button" @click="iniciar">Reanudar</button><button type="button" @click="frenar('detenido')">Detener</button></template>
        <template v-else>
          <button type="button" :disabled="!errores" @click="resaltar = resaltar ? null : 'error'">{{ resaltar ? 'Ver todos' : 'Resaltar errores' }}</button>
          <button type="button" @click="reiniciar">Reiniciar</button>
        </template>
      </template>
    </TarjetaProceso>
  </div>
</template>

<style scoped>
.uno { width: 100%; max-width: 360px; }
</style>
