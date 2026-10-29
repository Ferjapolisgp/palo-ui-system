<script setup>
import { ActionCard, notificar } from 'palo-ui-system';

const avisar = (t) => notificar({ titulo: `Abrir: ${t}`, detalle: 'Datos de ejemplo: no hay a dónde ir.' });
</script>

<template>
  <div class="grilla">
    <ActionCard icono="tarjeta" titulo="Registrar cobro" texto="Cargá un cobro hecho por fuera de la app." @abrir="avisar('Registrar cobro')" />
    <ActionCard icono="usuarios" titulo="Altas pendientes" texto="Cuentas esperando documentación." :contador="12" tono="aviso" @abrir="avisar('Altas pendientes')" />
    <ActionCard icono="reloj" titulo="Solicitudes vencidas" texto="Pasaron su plazo de respuesta." :contador="9" tono="error" @abrir="avisar('Solicitudes vencidas')" />
    <ActionCard icono="informes" titulo="Informe del mes" texto="Se habilita el día 1." disabled />
    <ActionCard icono="documento" titulo="Guía de uso" texto="Es un enlace: va a la guía de instalación." href="#/instalacion" />
  </div>
</template>

<style scoped>
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; width: 100%; }
</style>
