<script setup>
import { Tarjeta } from 'palo-ui-system';
</script>

<template>
  <div class="espacio">
    <Tarjeta class="marco-corte esquinas" titulo="Contrato de locación 2026.pdf" subtitulo="DOC-0412" style="width: 100%; max-width: 380px">
      <template #extra><span class="tag aviso">Por firmar</span></template>
      <dl>
        <dt>Área</dt><dd>Legales</dd>
        <dt>Firmantes</dt><dd>1 de 2</dd>
        <dt>Vence</dt><dd>en 3 d</dd>
      </dl>
    </Tarjeta>
  </div>
</template>

<style scoped>
.espacio { width: 100%; padding: 22px; }
</style>
