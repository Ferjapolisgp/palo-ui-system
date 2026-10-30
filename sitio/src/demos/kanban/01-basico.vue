<script setup>
import { ref } from 'vue';
import { Kanban } from 'palo-ui-system';

// Lo mínimo: columnas, tarjetas y qué hacer al mover. La app es dueña de los datos.
const columnas = [
  { id: 'pendiente', titulo: 'Pendiente' },
  { id: 'curso', titulo: 'En curso' },
  { id: 'hecho', titulo: 'Hecho', tono: 'ok' },
];
const tareas = ref([
  { id: 1, codigo: 'DOC-0412', titulo: 'Revisar contrato de locación', estado: 'pendiente' },
  { id: 2, codigo: 'DOC-0415', titulo: 'Subir constancia de inscripción', estado: 'pendiente' },
  { id: 3, codigo: 'ALTA-2087', titulo: 'Pedir DNI del garante', estado: 'curso' },
  { id: 4, codigo: 'TK-1031', titulo: 'Cambiar titular de la cuenta', estado: 'hecho' },
]);
function mover({ item, hacia }) {
  item.estado = hacia;
}
</script>

<template>
  <Kanban :columnas="columnas" :items="tareas" style="width: 100%" @mover="mover" />
</template>
