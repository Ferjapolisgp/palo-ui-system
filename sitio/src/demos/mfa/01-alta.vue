<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';
import { ConfigurarMfa, notificar, uriTotp } from 'palo-ui-system';

// La clave la genera el servidor; acá es una de ejemplo.
const secreto = 'JBSWY3DPEHPK3PXP';
const qr = ref('');
QRCode.toDataURL(uriTotp({ secreto, cuenta: 'ana.ruiz@ejemplo.com', emisor: 'Palo Docs' }), { margin: 1, width: 280 }).then((url) => (qr.value = url));

const verificando = ref(false);
const error = ref('');
function verificar(codigo) {
  verificando.value = true;
  error.value = '';
  setTimeout(() => {
    verificando.value = false;
    if (codigo === '000000') error.value = 'El código no coincide. Revisá que la hora del celular esté bien y probá con el código nuevo.';
    else notificar({ titulo: 'Segundo factor activado', detalle: 'Datos de ejemplo: no se guardó nada.' });
  }, 800);
}
</script>

<template>
  <ConfigurarMfa en-linea :secreto="secreto" :qr="qr" :verificando="verificando" :error="error"
                 @verificar="verificar" @cancelar="notificar({ titulo: 'Alta cancelada' })" />
</template>
