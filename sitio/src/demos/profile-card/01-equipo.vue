<script setup>
import { ref } from 'vue';
import { Interruptor, ProfileCard } from 'palo-ui-system';

const cargando = ref(false);
const equipo = [
  { nombre: 'Ana Ruiz', rol: 'Soporte · turno mañana', estado: { texto: 'En línea', tono: 'ok' }, contactos: [{ icono: 'enlace', texto: 'ana.ruiz@ejemplo.com', href: 'mailto:ana.ruiz@ejemplo.com' }, { icono: 'ticket', texto: '7 asignadas' }] },
  { nombre: 'Lucas Gómez', rol: 'Pagos · conciliación', estado: { texto: 'Ocupado', tono: 'aviso' }, contactos: [{ icono: 'enlace', texto: 'lucas.gomez@ejemplo.com', href: 'mailto:lucas.gomez@ejemplo.com' }, { icono: 'ticket', texto: '12 asignadas' }] },
  { nombre: 'Carla Méndez', rol: 'Onboarding', estado: { texto: 'Ausente', tono: '' }, contactos: [{ icono: 'enlace', texto: 'carla.mendez@ejemplo.com', href: 'mailto:carla.mendez@ejemplo.com' }, { icono: 'ticket', texto: '0 asignadas' }] },
];
</script>

<template>
  <div class="todo">
    <Interruptor v-model="cargando">Cargando</Interruptor>
    <div class="grilla">
      <ProfileCard v-for="p in equipo" :key="p.nombre" v-bind="p" :cargando="cargando">
        <template #acciones><button type="button">Ver tareas</button><button type="button" class="primario">Reasignar</button></template>
      </ProfileCard>
    </div>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 14px; width: 100%; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; align-items: start; }
</style>
