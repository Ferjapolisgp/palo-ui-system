<script setup>
import { Advertencia } from 'palo-ui-system';
</script>

<template>
  <Advertencia>Vencido hace 18 h</Advertencia>
  <Advertencia tono="aviso">Vence en 3 h</Advertencia>
  <Advertencia>Firma bloqueada</Advertencia>
  <div style="width: 100%; max-width: 320px"><Advertencia bloque>Alta sin documentación · 5 d</Advertencia></div>
</template>
