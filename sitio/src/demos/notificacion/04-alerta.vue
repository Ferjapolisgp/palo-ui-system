<script setup>
import { onBeforeUnmount } from 'vue';
import { Notificaciones, alertar, cerrarTodas } from 'palo-ui-system';

// Vista previa en la página: la misma alerta, en un canal propio y sin posición fija.
const ALERTA = {
  titulo: 'Atención',
  detalle: 'Se detectaron 3 accesos con la misma clave desde otro país. Las sesiones quedaron bloqueadas hasta que alguien de Seguridad las revise.',
  accion: { texto: 'Revisar accesos', hacer: () => {} },
};
alertar({ ...ALERTA, canal: 'demo-alerta' });
alertar({ ...ALERTA, tono: 'aviso', titulo: 'Precaución', detalle: 'El respaldo de anoche terminó con 2 archivos sin copiar. Revisalo antes del cierre del día.', accion: null, canal: 'demo-alerta' });
onBeforeUnmount(() => cerrarTodas('demo-alerta'));
</script>

<template>
  <div class="demo-alerta">
    <Notificaciones canal="demo-alerta" :fija="false" :maximo="2" />
    <button type="button" class="peligro" @click="alertar(ALERTA)">Disparar alerta</button>
  </div>
</template>

<style scoped>
.demo-alerta { display: grid; gap: 14px; justify-items: start; }
</style>
