<script setup>
import { Kanban, notificar } from 'palo-ui-system';

// Para quien solo mira (auditoría): sin arrastre, pero se puede abrir cada tarjeta con clic o Enter.
const columnas = [
  { id: 'pedido', titulo: 'Documentación pedida' },
  { id: 'recibido', titulo: 'Recibida' },
  { id: 'aprobado', titulo: 'Aprobada', tono: 'ok' },
];
const altas = [
  { id: 'ALTA-2087', titulo: 'Sosa Diseño SRL', estado: 'pedido' },
  { id: 'ALTA-2090', titulo: 'Paz Logística', estado: 'recibido' },
  { id: 'ALTA-2079', titulo: 'Méndez Estudio', estado: 'aprobado' },
];
</script>

<template>
  <Kanban :columnas="columnas" :items="altas" solo-lectura style="width: 100%"
          @abrir="(a) => notificar({ tono: 'info', titulo: `Abrir ${a.id}`, detalle: a.titulo })">
    <template #tarjeta="{ item }"><span class="kb-codigo">{{ item.id }}</span><span class="kb-titulo">{{ item.titulo }}</span></template>
    <template #vacio><p class="vacio">Nada en esta etapa</p></template>
  </Kanban>
</template>

<style scoped>
.kb-codigo { font: 700 .72rem var(--mono); letter-spacing: .06em; color: var(--sub); }
.kb-titulo { font-size: .86rem; }
.vacio { margin: 0; font-size: .8rem; color: var(--tenue); }
</style>
