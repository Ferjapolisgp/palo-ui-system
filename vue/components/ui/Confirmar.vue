<script setup>
// Confirmación de una acción sin vuelta atrás (por ejemplo, cerrar un ticket).
defineProps({ titulo: { type: String, required: true }, texto: String, boton: { type: String, default: 'Confirmar' }, peligro: Boolean });
const emit = defineEmits(['confirmar', 'cancelar']);
</script>

<template>
  <div class="velo" @click.self="emit('cancelar')" @keydown.esc="emit('cancelar')">
    <div class="caja" role="alertdialog" aria-modal="true" :aria-label="titulo">
      <h3>{{ titulo }}</h3>
      <p v-if="texto">{{ texto }}</p>
      <div class="acciones">
        <button type="button" autofocus @click="emit('cancelar')">Cancelar</button>
        <button type="button" :class="peligro ? 'peligro' : 'primario'" @click="emit('confirmar')">{{ boton }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.velo { position: fixed; inset: 0; background: rgba(0, 0, 0, .55); display: grid; place-items: center; z-index: 100; padding: 16px; }
.caja { background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-lg); padding: 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 48px rgba(0, 0, 0, .45); }
h3 { margin: 0 0 8px; font-size: 1rem; }
p { margin: 0; color: var(--sub); }
.acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
</style>
