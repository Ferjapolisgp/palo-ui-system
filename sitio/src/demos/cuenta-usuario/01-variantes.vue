<script setup>
import { ref } from 'vue';
import { CuentaUsuario } from 'palo-ui-system';

const elegida = ref('');
// Datos de ejemplo
const opciones = [
  { texto: 'Mi perfil', icono: 'usuario', valor: 'perfil' },
  { texto: 'Preferencias', icono: 'ajustes', valor: 'preferencias' },
  { texto: 'Cerrar sesión', icono: 'salir', valor: 'salir', tono: 'error' },
];
</script>

<template>
  <div class="todo">
    <div class="filas">
      <div class="caja"><p class="etq">completa</p><CuentaUsuario nombre="Ana Ruiz" detalle="Soporte · turno mañana" :opciones="opciones" @elegir="(o) => (elegida = o.texto)" /></div>
      <div class="caja"><p class="etq">compacta</p><CuentaUsuario nombre="Ana Ruiz" variante="compacta" :opciones="opciones" @elegir="(o) => (elegida = o.texto)" /></div>
      <div class="caja"><p class="etq">tarjeta</p><CuentaUsuario nombre="Ana Ruiz" detalle="ana.ruiz@ejemplo.com" variante="tarjeta" :opciones="opciones" @elegir="(o) => (elegida = o.texto)" /></div>
      <div class="caja ang"><p class="etq">colapsada</p><CuentaUsuario nombre="Ana Ruiz" colapsada :opciones="opciones" @elegir="(o) => (elegida = o.texto)" /></div>
      <div class="caja"><p class="etq">solo identifica</p><CuentaUsuario nombre="Lucas Gómez" detalle="Pagos · conciliación" /></div>
      <div class="caja"><p class="etq">sin identificar</p><CuentaUsuario detalle="Sesión sin iniciar" /></div>
      <div class="caja"><p class="etq">cargando</p><CuentaUsuario cargando /></div>
    </div>
    <p class="sub">Elegiste: <b>{{ elegida || '—' }}</b></p>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 12px; width: 100%; }
.filas { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
.caja { display: grid; gap: 8px; padding: 14px; background: var(--panel); border: 1px solid var(--borde); }
.ang { width: 90px; }
.etq { margin: 0; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.sub { margin: 0; color: var(--sub); }
</style>
