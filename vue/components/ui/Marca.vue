<script setup>
import { computed } from 'vue';

// Logo: el cardón en el cuadro verde con esquinas marcadas, y el nombre con la serie debajo.
// «PALO» es fijo; `producto` completa el nombre de cada herramienta: PAY, DOCS, ONBOARDING, TICKETS…
// El verde y la flor salen de --logo-*: son de marca, no se usan en la interfaz.
// tam: 'sm' | 'md' | 'lg' (grande es el alias de 'lg'). orientacion: 'horizontal' | 'vertical'.
// tono: 'color' | 'mono' (una sola tinta, para fondos de color e impresión). soloTexto: sin el cuadro.
// verde: «PALO» en el verde del logo en vez del color de texto.
const props = defineProps({
  producto: { type: String, default: '' }, serie: { type: String, default: '' },
  tam: { type: String, default: 'md' }, grande: Boolean,
  orientacion: { type: String, default: 'horizontal' }, tono: { type: String, default: 'color' },
  soloIcono: Boolean, soloTexto: Boolean, verde: Boolean,
});
const medida = computed(() => (props.grande ? 'lg' : props.tam));
const nombre = computed(() => ['Palo', props.producto].filter(Boolean).join(' '));
const suelto = computed(() => props.soloIcono || props.soloTexto);
</script>

<template>
  <span class="marca" :class="[`t-${medida}`, orientacion, { mono: tono === 'mono', verde }]" :role="suelto ? 'img' : undefined" :aria-label="suelto ? nombre : undefined">
    <span v-if="!soloTexto" class="ico">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21V6" stroke-width="4" />
          <path d="M12 15H8.5A1.5 1.5 0 0 1 7 13.5V10" stroke-width="2.6" />
          <path d="M12 12.5h3.5a1.5 1.5 0 0 0 1.5-1.5V8" stroke-width="2.6" />
        </g>
        <circle class="flor" cx="12" cy="3" r="1.9" />
      </svg>
    </span>
    <span v-if="!soloIcono" class="txt"><b>PALO<span v-if="producto">{{ producto.toUpperCase() }}</span></b><small v-if="serie">{{ serie }}</small></span>
  </span>
</template>

<style scoped>
.marca { --lado: 30px; display: inline-flex; align-items: center; gap: 10px; color: var(--txt); min-width: 0; }
.t-sm { --lado: 22px; } .t-lg { --lado: 48px; }
.ico { position: relative; width: var(--lado); height: var(--lado); display: grid; place-items: center; background: var(--logo-fondo); color: var(--logo-figura); border-radius: var(--r-sm); flex: none; }
.ico svg { width: 72%; height: 72%; }
.flor { fill: var(--logo-flor); }
.ico::before, .ico::after { content: ""; position: absolute; width: calc(var(--lado) * .23); height: calc(var(--lado) * .23); border: 2px solid var(--marco, var(--panel)); }
.ico::before { top: -3px; left: -3px; border-right: 0; border-bottom: 0; }
.ico::after { bottom: -3px; right: -3px; border-left: 0; border-top: 0; }
.txt { min-width: 0; }
b { display: block; font-family: var(--display); font-weight: 800; font-stretch: 125%; letter-spacing: .1em; font-size: calc(var(--lado) * .27); }
b span { font-weight: 500; }
small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font: 500 calc(var(--lado) * .2) var(--mono); letter-spacing: .08em; color: var(--sub); }
.t-sm small { font-size: .56rem; } .t-md small { font-size: .6rem; } .t-lg small { font-size: .66rem; }
.t-lg b { font-size: 1.05rem; }
.t-sm b { font-size: .68rem; } .t-md b { font-size: .8rem; }
.t-sm .ico::before, .t-sm .ico::after { width: 6px; height: 6px; }
.vertical { flex-direction: column; gap: 8px; text-align: center; }
/* Una sola tinta: el cuadro en el color de texto y la figura recortada con el fondo */
.mono .ico { background: var(--txt); color: var(--marco, var(--bg)); }
.mono .flor { fill: var(--marco, var(--bg)); }
.verde b { color: var(--logo-fondo); }
.verde b span { color: var(--txt); }
</style>
