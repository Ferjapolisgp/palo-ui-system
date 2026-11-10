<script setup>
import { TarjetaProceso } from 'palo-ui-system';

// Datos de ejemplo
const etapas = [
  { texto: 'Datos cargados', estado: 'hecha' }, { texto: 'Documentación recibida', estado: 'hecha' },
  { texto: 'Validación de identidad', estado: 'actual' }, { texto: 'Aprobación' }, { texto: 'Alta en el sistema' },
];
</script>

<template>
  <div class="grilla">
    <TarjetaProceso codigo="PR-0414 · Serie 03/05" titulo="Alta de proveedor" detalle="Etapa actual: Validación de identidad" estado="curso" :etapas="etapas">
      <template #pie>Hace <b>1 h 20 min</b></template>
      <template #acciones><button type="button">Ver detalle</button></template>
    </TarjetaProceso>

    <TarjetaProceso codigo="PR-0417" titulo="Firma de contrato marco" detalle="Faltan 2 de 3 firmas." estado="aviso" :avance="33"
                    cifra="1" unidad="de 3 firmas" vence="Vence hoy 18:00 · faltan 3 h 40 min">
      <template #pie>Firmaron <b>1</b> de <b>3</b></template>
      <template #acciones><button type="button">Recordar a firmantes</button></template>
    </TarjetaProceso>
  </div>
</template>

<style scoped>
.grilla { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); width: 100%; }
</style>
