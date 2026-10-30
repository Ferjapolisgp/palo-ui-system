<script setup>
import { ref } from 'vue';
import { Confirmar } from 'palo-ui-system';

const abierto = ref(false);
const resultado = ref('');
function eliminar() {
  abierto.value = false;
  resultado.value = 'Documento eliminado (ejemplo).';
}
</script>

<template>
  <button type="button" class="peligro" @click="abierto = true">Eliminar documento</button>
  <span class="sub">{{ resultado }}</span>
  <Confirmar v-if="abierto" peligro titulo="¿Eliminar «Contrato de locación 2026.pdf»?"
             texto="Deja de verse para las 6 personas con acceso. Las firmas ya hechas quedan en el registro."
             boton="Eliminar" @confirmar="eliminar" @cancelar="abierto = false" />
</template>
