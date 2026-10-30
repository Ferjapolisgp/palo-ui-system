<script setup>
import { GraficoComposicion } from 'palo-ui-system';
import { canalesPorMes } from '../../datos/ejemplo.js';
</script>

<template>
  <GraficoComposicion :datos="canalesPorMes" fila="mes" :partes="['Web', 'Mail', 'WhatsApp', 'Teléfono']"
                      descripcion="Participación de cada canal de ingreso de solicitudes de julio a octubre" style="width: 100%" />
</template>
