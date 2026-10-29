<script setup>
import Overlay from './Overlay.vue';

// Confirmación de una acción sin vuelta atrás (por ejemplo, cerrar un ticket). Se monta con v-if: montado es abierto.
defineProps({ titulo: { type: String, required: true }, texto: String, boton: { type: String, default: 'Confirmar' }, peligro: Boolean });
const emit = defineEmits(['confirmar', 'cancelar']);
</script>

<template>
  <Overlay abierto @cerrar="emit('cancelar')">
    <div class="caja" role="alertdialog" aria-modal="true" :aria-label="titulo">
      <h3>{{ titulo }}</h3>
      <p v-if="texto">{{ texto }}</p>
      <div class="acciones">
        <button type="button" autofocus @click="emit('cancelar')">Cancelar</button>
        <button type="button" :class="peligro ? 'peligro' : 'primario'" @click="emit('confirmar')">{{ boton }}</button>
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
.caja { background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-lg); padding: 20px; width: 100%; max-width: 420px; box-shadow: var(--sombra-2); }
h3 { margin: 0 0 8px; font-size: 1rem; }
p { margin: 0; color: var(--sub); }
.acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
</style>
