<script setup>
import { ref } from 'vue';
import { Advertencia, Avatar, Confirmar, Kanban, notificar } from 'palo-ui-system';

// Un tablero con reglas, como el de la Ticketera: el flujo dice a dónde puede ir cada tarjeta,
// «En curso» tiene límite y cerrar pide confirmación antes de mover.
const columnas = [
  { id: 'nuevo', titulo: 'Nuevo', tono: 'info' },
  { id: 'curso', titulo: 'En curso', limite: 3 },
  { id: 'revision', titulo: 'Revisión' },
  { id: 'cerrado', titulo: 'Cerrado', tono: 'ok' },
];
const tickets = ref([
  { id: 'TK-1042', titulo: 'No llega el mail de bienvenida', estado: 'nuevo', responsable: 'Ana Ruiz', vencida: false },
  { id: 'TK-1043', titulo: 'Error al subir el DNI', estado: 'nuevo', responsable: '', vencida: false },
  { id: 'TK-1039', titulo: 'Contrato sin la firma del garante', estado: 'curso', responsable: 'Mariana Sosa', vencida: true },
  { id: 'TK-1037', titulo: 'Cobro con QR duplicado', estado: 'curso', responsable: 'Lucas Gómez', vencida: false },
  { id: 'TK-1036', titulo: 'Factura emitida con CUIT equivocado', estado: 'curso', responsable: 'Ana Ruiz', vencida: false },
  { id: 'TK-1031', titulo: 'Cambio de titular de la cuenta', estado: 'revision', responsable: 'Julián Paz', vencida: false },
]);

// El flujo: un paso por vez hacia adelante, o volver a «En curso» desde Revisión. Sin responsable no se trabaja.
const SIGUIENTE = { nuevo: ['curso'], curso: ['revision'], revision: ['cerrado', 'curso'], cerrado: [] };
function puedeSoltar(t, hacia) {
  if (!SIGUIENTE[t.estado].includes(hacia)) return { ok: false, motivo: 'el flujo va un paso por vez' };
  if (hacia === 'curso' && !t.responsable) return { ok: false, motivo: 'primero asigná un responsable' };
  return true;
}

const porCerrar = ref(null);
function mover({ item, hacia, indice }) {
  if (hacia === 'cerrado') return (porCerrar.value = { item, indice });
  ubicar(item, hacia, indice);
}
// Ordenable: además de la columna, respeta el lugar donde se soltó.
function ubicar(item, hacia, indice) {
  const lista = tickets.value.filter((t) => t !== item);
  const enDestino = lista.filter((t) => t.estado === hacia);
  const antes = enDestino[indice];
  item.estado = hacia;
  lista.splice(antes ? lista.indexOf(antes) : lista.length, 0, item);
  tickets.value = lista;
}
function cerrar() {
  const { item, indice } = porCerrar.value;
  porCerrar.value = null;
  ubicar(item, 'cerrado', indice);
  notificar({ titulo: 'Ticket cerrado', detalle: `${item.id} · datos de ejemplo` });
}
</script>

<template>
  <div class="demo-kanban">
    <Kanban :columnas="columnas" :items="tickets" :puede-soltar="puedeSoltar" ordenable etiqueta="Tablero de solicitudes"
            @mover="mover" @abrir="(t) => notificar({ tono: 'info', titulo: `Abrir ${t.id}`, detalle: 'Acá la app mostraría el detalle' })">
      <template #tarjeta="{ item }">
        <div class="fila"><span class="kb-codigo">{{ item.id }}</span><Avatar :nombre="item.responsable" :tam="20" /></div>
        <span class="kb-titulo">{{ item.titulo }}</span>
        <Advertencia v-if="item.vencida" animada>Vencida hace 4 h</Advertencia>
      </template>
    </Kanban>
    <Confirmar v-if="porCerrar" titulo="¿Cerrar el ticket?" :texto="`${porCerrar.item.id} ya no se va a poder modificar.`" boton="Cerrar ticket"
               @confirmar="cerrar" @cancelar="porCerrar = null" />
  </div>
</template>

<style scoped>
.demo-kanban { width: 100%; }
.fila { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.kb-codigo { font: 700 .72rem var(--mono); letter-spacing: .06em; color: var(--sub); }
.kb-titulo { font-size: .86rem; line-height: 1.35; }
</style>
