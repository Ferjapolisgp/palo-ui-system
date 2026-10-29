<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';
import { ConfigurarMfa, notificar, uriTotp } from 'palo-ui-system';

const abierto = ref(false);
const secreto = 'KRSXG5CTMVRXEZLU';
const qr = ref('');
QRCode.toDataURL(uriTotp({ secreto, cuenta: 'ana.ruiz@ejemplo.com', emisor: 'Palo Docs' }), { margin: 1, width: 280 }).then((url) => (qr.value = url));

function verificar() {
  abierto.value = false;
  notificar({ titulo: 'Segundo factor activado', detalle: 'Datos de ejemplo: no se guardó nada.' });
}
</script>

<template>
  <button type="button" class="primario" @click="abierto = true">Activar segundo factor</button>
  <ConfigurarMfa v-if="abierto" :secreto="secreto" :qr="qr" @verificar="verificar" @cancelar="abierto = false" />
</template>
