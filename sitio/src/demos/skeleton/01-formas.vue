<script setup>
import { ref } from 'vue';
import { Skeleton } from 'palo-ui-system';

const cargando = ref(true);
function recargar() {
  cargando.value = true;
  setTimeout(() => (cargando.value = false), 1200);
}
</script>

<template>
  <div class="formas">
    <button type="button" class="cargar" @click="cargando ? (cargando = false) : recargar()">{{ cargando ? 'Cargar' : 'Volver a cargar' }}</button>
    <section>
      <p class="etiqueta-seccion">Texto</p>
      <Skeleton v-if="cargando" :lineas="3" />
      <p v-else class="texto">Falta la firma del garante en la página 3 del contrato. Se pidió el 21/10 y se reiteró el 24/10; sin respuesta desde entonces.</p>
    </section>
    <section>
      <p class="etiqueta-seccion">Fila</p>
      <Skeleton v-if="cargando" forma="fila" />
      <div v-else class="fila"><b>TK-1039</b><span>Contrato sin la firma del garante</span><span class="sub">Docs</span><span class="tag error">Vencida</span></div>
    </section>
    <section>
      <p class="etiqueta-seccion">Tarjeta</p>
      <Skeleton v-if="cargando" forma="tarjeta" :lineas="2" />
      <div v-else class="tarjeta"><b>Mariana Sosa</b><span class="sub">Solicitante · 3 solicitudes abiertas</span><span class="sub">Última respuesta hace 2 días</span></div>
    </section>
    <section>
      <p class="etiqueta-seccion">Gráfico</p>
      <Skeleton v-if="cargando" forma="grafico" :alto="120" />
      <div v-else class="barras" aria-label="Ingresadas por día" role="img"><i v-for="h in [40, 64, 52, 80, 36, 72, 58]" :key="h" :style="{ height: h + '%' }"></i></div>
    </section>
  </div>
</template>

<style scoped>
.formas { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 22px; width: 100%; }
.cargar { grid-column: 1 / -1; justify-self: start; }
section { display: grid; gap: 10px; align-content: start; }
.texto { margin: 0; font-size: .9rem; }
.fila { display: grid; grid-template-columns: 70px minmax(0, 1fr) auto auto; gap: 16px; align-items: center; font-size: .86rem; }
.fila b { font: 700 .78rem var(--mono); }
.fila span:nth-child(2) { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tarjeta { display: grid; gap: 8px; padding: 16px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); font-size: .86rem; }
.barras { display: flex; align-items: flex-end; gap: 10px; height: 120px; border-bottom: 1px solid var(--borde); }
.barras i { flex: 1; background: var(--serie-1); border-radius: var(--r-sm) var(--r-sm) 0 0; }
</style>
