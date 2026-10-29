<script setup>
import { ref } from 'vue';
import { CodigoVerificacion } from 'palo-ui-system';

const codigo = ref('');
const estado = ref(''); // '' | 'verificando' | 'error' | 'ok'
function verificar(c) {
  estado.value = 'verificando';
  setTimeout(() => { estado.value = c === '000000' ? 'error' : 'ok'; }, 700); // Ejemplo: lo responde el servidor.
}
function cambio(c) {
  codigo.value = c;
  if (estado.value === 'error') estado.value = '';
}
</script>

<template>
  <div class="ingreso">
    <h3>Verificación en dos pasos</h3>
    <p class="sub">Escribí el código de 6 dígitos de tu app de autenticación.</p>
    <CodigoVerificacion :model-value="codigo" :error="estado === 'error'" :disabled="estado === 'verificando'" @update:model-value="cambio" @completo="verificar" />
    <p v-if="estado === 'error'" class="error" role="alert">El código no coincide o ya venció. Probá con el que muestra ahora la app.</p>
    <p v-else class="sub" aria-live="polite">{{ estado === 'verificando' ? 'Verificando…' : estado === 'ok' ? 'Listo: sesión iniciada (ejemplo).' : '' }}</p>
  </div>
</template>

<style scoped>
.ingreso { display: grid; gap: 12px; width: 100%; max-width: 400px; }
h3, p { margin: 0; }
.error { color: var(--error); font-size: .85rem; }
</style>
