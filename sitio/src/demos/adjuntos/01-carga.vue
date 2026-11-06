<script setup>
import { ref } from 'vue';
import { Adjuntos } from 'palo-ui-system';

// La librería no sube nada: acá se simula el progreso para mostrar los estados.
const archivos = ref([
  { id: 1, nombre: 'constancia-afip.pdf', tamano: 842000, estado: 'listo' },
  { id: 2, nombre: 'estatuto-social.pdf', tamano: 3400000, estado: 'subiendo', progreso: 55 },
  { id: 3, nombre: 'balance-2025.xlsx', tamano: 1200000, estado: 'error', error: 'Se cortó la conexión. Probá de nuevo.' },
]);
let n = 10;

function agregar(lista) {
  for (const f of lista) {
    const a = { id: n++, nombre: f.name, tamano: f.size, estado: 'subiendo', progreso: 0 };
    archivos.value.push(a);
    subir(a);
  }
}
function subir(a) {
  a.estado = 'subiendo';
  a.progreso = 0;
  const t = setInterval(() => {
    const vivo = archivos.value.find((x) => x.id === a.id);
    if (!vivo) return clearInterval(t);
    vivo.progreso = Math.min(100, vivo.progreso + 20);
    if (vivo.progreso >= 100) { vivo.estado = 'listo'; clearInterval(t); }
  }, 300);
}
</script>

<template>
  <Adjuntos :archivos="archivos" aceptar=".pdf,.xlsx,image/*" :maximo="20 * 1024 * 1024" @agregar="agregar" @quitar="(a) => (archivos = archivos.filter((x) => x.id !== a.id))" @reintentar="subir" />
</template>
