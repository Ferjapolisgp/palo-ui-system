<script setup>
import { computed } from 'vue';
import GraficoMarco from './GraficoMarco.vue';
import { formatoNumero } from '../../lib/graficos.js';

// Cuán cerca está cada valor de su límite (por ejemplo, la facturación de 12 meses contra el tope de la categoría).
// Pasa a aviso desde `avisoDesde` % y a error al superar el 100 %; el estado siempre va escrito.
const props = defineProps({
  filas: { type: Array, required: true },
  nombre: { type: String, required: true },
  detalle: String,
  valor: { type: String, required: true },
  limite: { type: String, required: true },
  formato: { type: Function, default: formatoNumero },
  avisoDesde: { type: Number, default: 85 },
  descripcion: { type: String, required: true },
});

const escala = 120;
const marca = 100 / escala * 100;
const items = computed(() => props.filas.map((f) => {
  const p = f[props.valor] / f[props.limite] * 100;
  const estado = p > 100 ? ['error', 'Supera el tope'] : p >= props.avisoDesde ? ['aviso', 'Cerca del tope'] : ['ok', 'Dentro del tope'];
  return { f, p, estado, ancho: Math.min(p, escala) / escala * 100 };
}));
const tabla = computed(() => ({ columnas: ['', 'Valor', 'Tope', '%'], filas: items.value.map(({ f, p }) => [f[props.nombre], props.formato(f[props.valor]), props.formato(f[props.limite]), `${Math.round(p)} %`]) }));
</script>

<template>
  <GraficoMarco :etiqueta="descripcion" :tabla="tabla">
    <div class="tope">
      <div class="escala"><span></span><div><span :style="{ left: marca + '%' }">Tope</span></div><span></span></div>
      <div v-for="it in items" :key="it.f[nombre]" class="fila">
        <div class="quien"><b>{{ it.f[nombre] }}</b><small v-if="detalle">{{ it.f[detalle] }}</small></div>
        <div class="barra"><i :class="`tono-${it.estado[0]}`" :style="{ width: it.ancho + '%' }"></i><span class="marca" :style="{ left: marca + '%' }"></span></div>
        <div class="dato"><b>{{ Math.round(it.p) }} %</b><span class="tag" :class="it.estado[0]">{{ it.estado[1] }}</span><small>{{ formato(it.f[valor]) }} de {{ formato(it.f[limite]) }}</small></div>
      </div>
    </div>
  </GraficoMarco>
</template>

<style scoped>
.tope { display: grid; gap: 14px; }
.fila, .escala { display: grid; grid-template-columns: 130px minmax(0, 1fr) 200px; gap: 16px; align-items: center; }
.escala > div { position: relative; height: 14px; }
.escala > div > span { position: absolute; transform: translateX(-50%); font: 600 .62rem var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--sub); }
.quien b { display: block; font-size: .88rem; }
.quien small { font: 600 .7rem var(--mono); color: var(--sub); }
.barra { position: relative; height: 14px; background: var(--panel-2); border: 1px solid var(--borde); border-radius: var(--r-sm); }
.barra i { position: absolute; inset: 0 auto 0 0; border-radius: 3px; background: var(--serie-1); }
.barra i.tono-aviso { background: var(--aviso); }
.barra i.tono-error { background: var(--error); }
.marca { position: absolute; top: -6px; bottom: -6px; width: 2px; background: var(--txt); transform: translateX(-1px); }
.dato { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
.dato b { font: 700 .92rem var(--mono); }
.dato small { width: 100%; color: var(--sub); font-size: .76rem; }
@media (max-width: 640px) {
  .fila, .escala { grid-template-columns: minmax(0, 1fr); gap: 6px; }
  .escala > span { display: none; }
  .fila { padding-bottom: 8px; border-bottom: 1px solid var(--borde); }
}
</style>
