<script setup>
import { TarjetaProceso } from 'palo-ui-system';
</script>

<template>
  <div class="grilla">
    <TarjetaProceso codigo="PR-0412" titulo="Importación de documentos" detalle="Carpeta «Legajos 2026» · 180 archivos (ejemplo)"
                    estado="curso" :avance="62" conteo="112 / 180 archivos">
      <template #pie>Hace <b>04:12</b> · Faltan <b>~02:30</b></template>
      <template #acciones><button type="button">Pausar</button><button type="button">Cancelar</button></template>
    </TarjetaProceso>

    <TarjetaProceso codigo="PR-0418" titulo="Carga masiva de altas" detalle="Lote de 500 registros (ejemplo)" estado="curso"
                    :segmentos="[{ texto: 'Correctos', valor: 318, tono: 'ok' }, { texto: 'Con error', valor: 7, tono: 'error' }, { texto: 'Pendientes', valor: 175, tono: 'resto' }]">
      <template #pie>Hace <b>06:40</b> · <b>47</b> reg/min</template>
      <template #acciones><button type="button">Ver errores</button><button type="button">Pausar</button></template>
    </TarjetaProceso>

    <TarjetaProceso codigo="PR-0419" titulo="Cierre de cobros del día" detalle="Terminó a las 13:42 sin observaciones (ejemplo)"
                    estado="ok" :avance="100" :cifra="'1.204'" unidad="cobros" conteo="$ 8.742.310,50">
      <template #pie>Duró <b>03:18</b></template>
      <template #acciones><button type="button">Ver resumen</button></template>
    </TarjetaProceso>
  </div>
</template>

<style scoped>
.grilla { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); width: 100%; }
</style>
