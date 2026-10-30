<script setup>
import { computed, ref } from 'vue';
import Overlay from './Overlay.vue';

// Reasignar el ticket a otra persona. Si ya tenía responsable se pide el motivo: queda como comentario del ticket.
const props = defineProps({
  usuarios: { type: Array, required: true },
  actualId: Number,
  titulo: { type: String, default: 'Reasignar' },
  motivoObligatorio: Boolean,
});
const emit = defineEmits(['confirmar', 'cancelar']);

const opciones = computed(() => props.usuarios.filter((u) => u.id !== props.actualId));
const destino = ref('');
const motivo = ref('');
const valido = computed(() => destino.value !== '' && (!props.motivoObligatorio || motivo.value.trim() !== ''));
function enviar() {
  if (!valido.value) return;
  const u = opciones.value.find((x) => x.id === Number(destino.value));
  emit('confirmar', { id: u.id, nombre: u.nombre, nota: motivo.value.trim() });
}
</script>

<template>
  <Overlay abierto @cerrar="emit('cancelar')">
    <form class="caja" role="dialog" aria-modal="true" :aria-label="titulo" @submit.prevent="enviar">
      <h3>{{ titulo }}</h3>
      <label for="re-dest">Pasa a</label>
      <select id="re-dest" v-model="destino" required autofocus>
        <option value="" disabled>Elegí a la persona…</option>
        <option v-for="u in opciones" :key="u.id" :value="u.id">{{ u.nombre }}</option>
      </select>
      <label for="re-motivo">Motivo{{ motivoObligatorio ? '' : ' (opcional)' }}</label>
      <textarea id="re-motivo" v-model="motivo" rows="3" placeholder="Por qué cambia de responsable"></textarea>
      <p class="ayuda">Queda como comentario del ticket y en el historial.</p>
      <div class="acciones">
        <button type="button" @click="emit('cancelar')">Cancelar</button>
        <button class="primario" :disabled="!valido">Reasignar</button>
      </div>
    </form>
  </Overlay>
</template>

<style scoped>
.caja { display: grid; gap: 6px; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-lg); padding: 20px; width: 100%; max-width: 440px; box-shadow: var(--sombra-2); }
h3 { margin: 0 0 6px; font-size: 1rem; }
.ayuda { margin: 0; font-size: .78rem; color: var(--sub); }
.acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
</style>
