<script setup>
// Logo: el cardón en el cuadro verde con esquinas marcadas, y el nombre con la serie debajo.
// «PALO» es fijo; `producto` completa el nombre de cada herramienta: PAY, DOCS, ONBOARDING, TICKETS…
// El verde y la flor salen de --logo-*: son de marca, no se usan en la interfaz.
const props = defineProps({ producto: { type: String, default: '' }, serie: { type: String, default: '' }, grande: Boolean, soloIcono: Boolean });
</script>

<template>
  <span class="marca" :class="{ grande }" :role="soloIcono ? 'img' : undefined" :aria-label="soloIcono ? ['Palo', props.producto].filter(Boolean).join(' ') : undefined">
    <span class="ico">
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
.marca { display: inline-flex; align-items: center; gap: 10px; color: var(--txt); min-width: 0; }
.ico { position: relative; width: 30px; height: 30px; display: grid; place-items: center; background: var(--logo-fondo); color: var(--logo-figura); border-radius: var(--r-sm); flex: none; }
.ico svg { width: 72%; height: 72%; }
.flor { fill: var(--logo-flor); }
.ico::before, .ico::after { content: ""; position: absolute; width: 7px; height: 7px; border: 2px solid var(--marco, var(--panel)); }
.ico::before { top: -3px; left: -3px; border-right: 0; border-bottom: 0; }
.ico::after { bottom: -3px; right: -3px; border-left: 0; border-top: 0; }
.txt { min-width: 0; }
b { display: block; font-family: var(--display); font-weight: 800; font-stretch: 125%; letter-spacing: .1em; font-size: .8rem; }
b span { font-weight: 500; }
small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font: 500 .6rem var(--mono); letter-spacing: .08em; color: var(--sub); }
.grande .ico { width: 48px; height: 48px; }
.grande b { font-size: 1.05rem; }
.grande small { font-size: .66rem; }
</style>
