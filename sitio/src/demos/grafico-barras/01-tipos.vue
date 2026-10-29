<script setup>
import { GraficoBarras } from 'palo-ui-system';
import { porTipo } from '../../datos/ejemplo.js';
</script>

<template>
  <GraficoBarras :datos="porTipo" x="tipo" y="documentos" etiqueta="Documentos"
                 descripcion="Documentos cargados por tipo, de Contratos con 412 a Otros con 38" style="width: 100%" />
</template>
