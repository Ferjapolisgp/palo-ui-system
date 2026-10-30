<script setup>
import { Icono, Tooltip } from 'palo-ui-system';
</script>

<template>
  <div class="usos">
    <div class="grupo">
      <Tooltip texto="Copiar enlace"><button type="button" class="icono" aria-label="Copiar enlace"><Icono nombre="copiar" /></button></Tooltip>
      <Tooltip texto="Ver como tabla" lado="abajo"><button type="button" class="icono" aria-label="Ver como tabla"><Icono nombre="tabla" /></button></Tooltip>
      <Tooltip texto="Ajustes de la bandeja" lado="derecha"><button type="button" class="icono" aria-label="Ajustes de la bandeja"><Icono nombre="ajustes" /></button></Tooltip>
    </div>
    <Tooltip>
      <span class="tag error" tabindex="0">SLA vencido</span>
      <template #contenido><b>Venció hace 4 h.</b> El plazo de esta área es de 48 h hábiles.</template>
    </Tooltip>
    <Tooltip texto="Contrato sin la firma del garante: se pidió el 21/10 y se reiteró el 24/10">
      <span class="recorte" tabindex="0">Contrato sin la firma del garante: se pidió el 21/10 y se reiteró el 24/10</span>
    </Tooltip>
  </div>
</template>

<style scoped>
.usos { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; }
.grupo { display: flex; gap: 4px; }
.recorte { display: block; max-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
</style>
