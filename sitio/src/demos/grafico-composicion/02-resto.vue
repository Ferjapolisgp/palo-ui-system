<script setup>
import { GraficoComposicion } from 'palo-ui-system';

// Origen de los documentos cargados en Docs por mes. «Sin clasificar» no es un dato principal: va en trama.
const origen = [
  { mes: 'Julio', Subidos: 46, Generados: 24, 'Sin clasificar': 30 },
  { mes: 'Agosto', Subidos: 48, Generados: 27, 'Sin clasificar': 25 },
  { mes: 'Septiembre', Subidos: 50, Generados: 29, 'Sin clasificar': 21 },
  { mes: 'Octubre', Subidos: 51, Generados: 31, 'Sin clasificar': 18 },
];
</script>

<template>
  <GraficoComposicion :datos="origen" fila="mes" :partes="['Subidos', 'Generados', 'Sin clasificar']" resto="Sin clasificar"
                      descripcion="Origen de los documentos por mes de julio a octubre; lo sin clasificar baja de 30 % a 18 %" style="width: 100%" />
</template>
