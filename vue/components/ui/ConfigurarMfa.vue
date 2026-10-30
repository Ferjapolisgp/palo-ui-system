<script setup>
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import CodigoVerificacion from './CodigoVerificacion.vue';
import Icono from './Icono.vue';
import Overlay from './Overlay.vue';
import { agruparSecreto } from '../../lib/mfa.js';

// Alta del segundo factor: escanear el QR (o copiar la clave) y confirmar con el primer código de la app.
// No valida nada: emite «verificar» con el código y el servidor responde; el error vuelve por la prop.
const props = defineProps({
  secreto: { type: String, required: true },
  qr: String,
  titulo: { type: String, default: 'Configurar app de autenticación' },
  largo: { type: Number, default: 6 },
  verificando: Boolean,
  error: String,
  enLinea: Boolean,
});
const emit = defineEmits(['verificar', 'cancelar']);
const id = useId();
const codigo = ref('');
const completo = computed(() => codigo.value.length === props.largo);

// El error se muestra hasta que se cambia el código que lo provocó.
const codigoConError = ref('');
watch(() => props.error, (e) => { if (e) codigoConError.value = codigo.value; });
const mostrarError = computed(() => props.error && codigo.value === codigoConError.value);

const copiado = ref(false);
const campoClave = ref(null);
let espera;
async function copiar() {
  try {
    await navigator.clipboard.writeText(props.secreto.replace(/\s/g, ''));
    copiado.value = true;
    clearTimeout(espera);
    espera = setTimeout(() => (copiado.value = false), 2000);
  } catch {
    campoClave.value?.select(); // Sin permiso de portapapeles: queda seleccionada para copiar a mano.
  }
}
onBeforeUnmount(() => clearTimeout(espera));

function enviar() {
  if (completo.value && !props.verificando) emit('verificar', codigo.value);
}
</script>

<template>
  <component :is="enLinea ? 'div' : Overlay" v-bind="enLinea ? {} : { abierto: true }" @cerrar="emit('cancelar')">
    <form class="caja encuadre" :class="{ flotante: !enLinea }" :tabindex="enLinea ? undefined : -1" :role="enLinea ? undefined : 'dialog'" :aria-modal="enLinea ? undefined : 'true'"
          :aria-labelledby="`${id}-t`" @submit.prevent="enviar">
      <header>
        <h3 :id="`${id}-t`">{{ titulo }}</h3>
        <button type="button" class="icono" aria-label="Cerrar" title="Cerrar" @click="emit('cancelar')"><Icono nombre="cerrar" /></button>
      </header>

      <section>
        <h4><Icono nombre="escanear" :tam="20" />Escanear el código QR</h4>
        <p class="sub">Escaneá el código con tu app de autenticación (Google Authenticator, Authy u otra) o cargá la clave a mano.</p>
        <div class="panel-qr encuadre">
          <div class="qr">
            <span class="esq"></span><span class="esq"></span><span class="esq"></span><span class="esq"></span>
            <slot name="qr"><img v-if="qr" :src="qr" alt="Código QR para la app de autenticación" width="140" height="140"></slot>
          </div>
          <div class="manual">
            <label :for="`${id}-c`">¿No podés escanearlo? Cargá la clave a mano:</label>
            <input :id="`${id}-c`" ref="campoClave" :value="agruparSecreto(secreto)" readonly spellcheck="false" @focus="$event.target.select()">
            <button type="button" @click="copiar"><Icono :nombre="copiado ? 'ok' : 'copiar'" :tam="16" />{{ copiado ? 'Copiada' : 'Copiar clave' }}</button>
            <span class="oculto" aria-live="polite">{{ copiado ? 'Clave copiada' : '' }}</span>
          </div>
        </div>
      </section>

      <section>
        <h4><Icono nombre="clave" :tam="20" />Ingresar el código de verificación</h4>
        <p :id="`${id}-a`" class="sub">Escribí el código de {{ largo }} dígitos que muestra la app.</p>
        <CodigoVerificacion v-model="codigo" :largo="largo" :error="!!mostrarError" :disabled="verificando" :autofocus="!enLinea" />
        <p v-if="mostrarError" class="error" role="alert">{{ error }}</p>
      </section>

      <footer>
        <button type="button" @click="emit('cancelar')">Cancelar</button>
        <button type="submit" class="primario" :disabled="!completo || verificando">{{ verificando ? 'Verificando…' : 'Verificar' }}</button>
      </footer>
    </form>
  </component>
</template>

<style scoped>
.caja { position: relative; display: grid; gap: 22px; width: 100%; max-width: 480px; padding: 22px; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-lg); }
.caja.flotante { box-shadow: var(--sombra-2); }
.caja:focus { outline: none; }
header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
h3 { margin: 0; font-size: 1.1rem; }
section { display: grid; gap: 10px; }
h4 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: .98rem; }
h4 .icono-svg { color: var(--sub); }
section > .sub { margin: 0; font-size: .88rem; }
.panel-qr { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 18px; padding: 16px; background: var(--bg); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.qr { position: relative; flex: none; display: grid; place-items: center; width: 164px; height: 164px; }
.qr img, .qr :slotted(img), .qr :slotted(svg) { display: block; width: 140px; height: 140px; border-radius: var(--r-sm); }
.esq { position: absolute; width: 18px; height: 18px; border: 2px solid var(--sub); }
.esq:nth-child(1) { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.esq:nth-child(2) { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.esq:nth-child(3) { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.esq:nth-child(4) { bottom: 0; right: 0; border-left: 0; border-top: 0; }
.manual { flex: 1 1 200px; display: grid; gap: 10px; justify-items: start; }
.manual label { font-size: .86rem; }
.manual input { font: 600 .86rem var(--mono); letter-spacing: .06em; }
.manual button { display: inline-flex; align-items: center; gap: 8px; }
.error { margin: 0; font-size: .85rem; color: var(--error); }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
footer { display: flex; justify-content: space-between; gap: 10px; }
@media (max-width: 440px) { .caja { padding: 18px 16px; } .panel-qr { justify-content: center; } }
</style>
