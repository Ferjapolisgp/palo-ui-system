<script setup>
import { ref } from 'vue';
import { Icono, Overlay } from 'palo-ui-system';

const abierto = ref(false);
</script>

<template>
  <button type="button" @click="abierto = true">Ver comprobante</button>
  <Overlay :abierto="abierto" @cerrar="abierto = false">
    <article class="comprobante" role="dialog" aria-modal="true" aria-label="Comprobante de TK-1037" tabindex="-1">
      <button type="button" class="icono cerrar" aria-label="Cerrar" @click="abierto = false"><Icono nombre="cerrar" /></button>
      <p class="etiqueta-seccion">Comprobante · TK-1037</p>
      <p class="monto">$ 18.450,00</p>
      <dl>
        <dt>Medio</dt><dd>QR</dd>
        <dt>Fecha</dt><dd>24/10/2026 14:32</dd>
        <dt>Operación</dt><dd class="cod">OP-88213409</dd>
      </dl>
    </article>
  </Overlay>
</template>

<style scoped>
.comprobante { position: relative; display: grid; gap: 14px; width: 100%; max-width: 340px; padding: 24px; background: var(--panel); border: 1px dashed var(--borde-fuerte); border-radius: var(--r-lg); box-shadow: var(--sombra-2); }
.comprobante:focus { outline: none; }
.cerrar { position: absolute; top: 10px; right: 10px; }
.monto { margin: 0; font: 700 1.8rem var(--mono); }
dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 0; font-size: .88rem; }
dt { color: var(--sub); }
dd { margin: 0; text-align: right; }
.cod { font: 600 .82rem var(--mono); }
</style>
