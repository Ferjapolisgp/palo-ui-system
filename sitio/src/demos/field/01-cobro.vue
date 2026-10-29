<script setup>
import { computed, reactive, ref } from 'vue';
import { CurrencyInput, DatePicker, Field, hoyIso, notificar } from 'palo-ui-system';

const cobro = reactive({ titular: '', cuit: '', monto: null, fecha: hoyIso(), medio: '', nota: '' });
const intentado = ref(false);
const fechaInvalida = ref('');

// Las reglas viven en la pantalla, no en Field: Field solo muestra el mensaje.
const errores = computed(() => {
  if (!intentado.value) return {};
  const cuit = cobro.cuit.replace(/\D/g, '');
  return {
    titular: !cobro.titular.trim() ? 'Escribí el nombre del titular.' : '',
    cuit: !cuit ? 'Escribí el CUIT.' : cuit.length !== 11 ? `Faltan dígitos: el CUIT tiene 11 y escribiste ${cuit.length}.` : '',
    monto: cobro.monto === null ? 'Escribí el monto cobrado.' : cobro.monto <= 0 ? 'El monto tiene que ser mayor a cero.' : '',
    fecha: fechaInvalida.value || (!cobro.fecha ? 'Elegí la fecha del cobro.' : ''),
    medio: !cobro.medio ? 'Elegí cómo pagó.' : '',
  };
});

function registrar() {
  intentado.value = true;
  if (Object.values(errores.value).some(Boolean)) return;
  notificar({ titulo: 'Cobro registrado', detalle: `${cobro.titular} · $ ${cobro.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })} (ejemplo)` });
  Object.assign(cobro, { titular: '', cuit: '', monto: null, fecha: hoyIso(), medio: '', nota: '' });
  intentado.value = false;
}
</script>

<template>
  <form class="cobro" novalidate @submit.prevent="registrar">
    <Field etiqueta="Titular" obligatorio :error="errores.titular"><input v-model="cobro.titular" autocomplete="off"></Field>
    <Field etiqueta="CUIT" obligatorio ayuda="11 dígitos, con o sin guiones." :error="errores.cuit"><input v-model="cobro.cuit" inputmode="numeric" autocomplete="off"></Field>
    <Field etiqueta="Monto" obligatorio :error="errores.monto"><CurrencyInput v-model="cobro.monto" /></Field>
    <Field etiqueta="Fecha del cobro" obligatorio ayuda="No puede ser futura." :error="errores.fecha">
      <DatePicker v-model="cobro.fecha" :max="hoyIso()" @update:model-value="fechaInvalida = ''"
                  @invalida="(e) => (fechaInvalida = e.motivo === 'fuera de los límites' ? 'La fecha no puede ser futura.' : 'Escribí la fecha como dd/mm/aaaa.')" />
    </Field>
    <Field etiqueta="Medio de pago" obligatorio :error="errores.medio">
      <select v-model="cobro.medio"><option value="" disabled>Elegí uno…</option><option>Transferencia</option><option>Efectivo</option><option>QR</option><option>Tarjeta de débito</option></select>
    </Field>
    <Field etiqueta="Nota" ayuda="Opcional. Queda en el historial de la cuenta." class="ancho"><textarea v-model="cobro.nota" rows="2"></textarea></Field>
    <div class="acciones ancho"><button type="submit" class="primario">Registrar cobro</button></div>
  </form>
</template>

<style scoped>
.cobro { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px 18px; width: 100%; }
.ancho { grid-column: 1 / -1; }
.acciones { display: flex; justify-content: flex-end; }
</style>
