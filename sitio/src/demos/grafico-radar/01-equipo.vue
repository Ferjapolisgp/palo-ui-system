<script setup>
import { GraficoRadar } from 'palo-ui-system';
import { ejesEquipo, perfilEquipo, perfilPromedio } from '../../datos/ejemplo.js';
</script>

<template>
  <GraficoRadar :ejes="ejesEquipo" :series="[
    { nombre: 'Equipo Onboarding', valores: perfilEquipo, estilo: 'rayado' },
    { nombre: 'Promedio de equipos', valores: perfilPromedio, estilo: 'linea' },
  ]" descripcion="Desempeño del equipo de Onboarding contra el promedio de los equipos en cinco dimensiones" style="width: 100%" />
</template>
