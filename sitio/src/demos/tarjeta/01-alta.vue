<script setup>
import { Tarjeta } from 'palo-ui-system';
</script>

<template>
  <Tarjeta titulo="Mariana Sosa" subtitulo="ALTA-2087" style="width: 100%; max-width: 380px">
    <template #extra><span class="tag aviso">Falta documentación</span></template>
    <dl>
      <dt>Empresa</dt><dd>Sosa Diseño SRL</dd>
      <dt>CUIT</dt><dd>30-71234567-9</dd>
      <dt>Documentos</dt><dd>3 de 5</dd>
      <dt>Iniciada</dt><dd>hace 2 d</dd>
    </dl>
    <template #acciones>
      <button type="button">Ver legajo</button>
      <button type="button" class="primario">Pedir documentación</button>
    </template>
  </Tarjeta>
</template>
