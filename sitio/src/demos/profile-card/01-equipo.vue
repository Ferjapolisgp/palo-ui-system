<script setup>
import { ref } from 'vue';
import { Icono, Interruptor, ProfileCard } from 'palo-ui-system';

const cargando = ref(false);
// Datos de ejemplo
const equipo = [
  { nombre: 'Ana Ruiz', rol: 'Soporte · turno mañana', verificado: true, estado: { texto: 'En línea', tono: 'ok' }, descripcion: 'Atiende solicitudes de clientes y deriva lo que pide revisión de pagos.',
    datos: [{ valor: '7', etiqueta: 'Asignadas' }, { valor: '4,8', etiqueta: 'Puntaje', icono: 'estrella' }, { valor: '2 h', etiqueta: 'Respuesta' }] },
  { nombre: 'Lucas Gómez', rol: 'Pagos · conciliación', estado: { texto: 'Ocupado', tono: 'aviso' }, descripcion: 'Concilia cobros y revisa diferencias antes del cierre del día.',
    datos: [{ valor: '12', etiqueta: 'Asignadas' }, { valor: '4,5', etiqueta: 'Puntaje', icono: 'estrella' }, { valor: '5 h', etiqueta: 'Respuesta' }] },
  { nombre: 'Carla Méndez', rol: 'Onboarding', descripcion: 'Acompaña las altas de nuevos equipos y revisa su documentación.',
    contactos: [{ icono: 'sobre', texto: 'carla.mendez@ejemplo.com', href: 'mailto:carla.mendez@ejemplo.com' }],
    datos: [{ valor: '0', etiqueta: 'Asignadas' }, { valor: '4,9', etiqueta: 'Puntaje', icono: 'estrella' }, { valor: '1 h', etiqueta: 'Respuesta' }] },
];
</script>

<template>
  <div class="todo">
    <Interruptor v-model="cargando">Cargando</Interruptor>
    <div class="grilla">
      <ProfileCard v-for="p in equipo" :key="p.nombre" v-bind="p" :cargando="cargando">
        <template #media-accion><button type="button" class="icono" aria-label="Guardar persona"><Icono nombre="marcador" :tam="18" /></button></template>
        <template #acciones><button type="button" class="primario"><Icono nombre="sobre" :tam="16" />Enviar mensaje</button></template>
      </ProfileCard>
    </div>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 14px; width: 100%; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; align-items: start; }
</style>
