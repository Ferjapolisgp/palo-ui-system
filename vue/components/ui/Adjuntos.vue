<script setup>
import { ref, useId } from 'vue';
import { tamanoArchivo } from '../../lib/formato.js';
import Icono from './Icono.vue';

// Zona para soltar o elegir archivos y la lista de lo cargado (documentación de altas, adjuntos de solicitudes).
// La librería NO sube nada: filtra tipo y tamaño, entrega los File con `agregar` y la app los sube y reporta el estado.
// archivos: [{ id, nombre, tamano, estado: 'subiendo' | 'listo' | 'error', progreso?, error? }]; progreso de 0 a 100.
// aceptar: como el atributo accept del input ('.pdf,image/*'). maximo: bytes por archivo.
// Eventos: agregar(File[]), quitar(archivo), reintentar(archivo), rechazado({ archivo, motivo }).
const props = defineProps({
  archivos: { type: Array, default: () => [] },
  aceptar: String,
  maximo: Number,
  multiple: { type: Boolean, default: true },
  deshabilitado: Boolean,
  etiqueta: { type: String, default: 'Adjuntos' },
});
const emit = defineEmits(['agregar', 'quitar', 'reintentar', 'rechazado']);

const id = useId();
const entrada = ref(null);
const arrastrando = ref(false);
const rechazos = ref([]);

function admitido(f) {
  if (!props.aceptar) return true;
  return props.aceptar.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).some((t) => (t.startsWith('.') ? f.name.toLowerCase().endsWith(t) : t.endsWith('/*') ? f.type.startsWith(t.slice(0, -1)) : f.type === t));
}
function recibir(lista) {
  const ok = [];
  rechazos.value = [];
  for (const f of [...lista].slice(0, props.multiple ? undefined : 1)) {
    const motivo = props.maximo && f.size > props.maximo ? `«${f.name}» supera los ${tamanoArchivo(props.maximo)}. Comprimilo y probá de nuevo.`
      : !admitido(f) ? `«${f.name}» no es un tipo permitido. Probá con ${props.aceptar}.` : '';
    if (motivo) { rechazos.value.push(motivo); emit('rechazado', { archivo: f, motivo }); } else ok.push(f);
  }
  if (ok.length) emit('agregar', ok);
}
const alElegir = (e) => { recibir(e.target.files); e.target.value = ''; };
const alSoltar = (e) => { arrastrando.value = false; if (!props.deshabilitado) recibir(e.dataTransfer?.files ?? []); };
const TONO = { listo: 'ok', error: 'error', subiendo: 'info' };
const TEXTO = { listo: 'Listo', error: 'Error', subiendo: 'Subiendo' };
</script>

<template>
  <section class="adjuntos" :aria-label="etiqueta">
    <button type="button" class="zona" :class="{ sobre: arrastrando }" :disabled="deshabilitado" :aria-describedby="`${id}-ayuda`"
            @click="entrada?.click()" @dragenter.prevent="arrastrando = true" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="alSoltar">
      <Icono nombre="subir" :tam="22" />
      <b>{{ arrastrando ? 'Soltá para agregar' : multiple ? 'Soltá los archivos o elegilos' : 'Soltá el archivo o elegilo' }}</b>
    </button>
    <input ref="entrada" type="file" class="oculto" :accept="aceptar" :multiple="multiple" :disabled="deshabilitado" tabindex="-1" aria-hidden="true" @change="alElegir">
    <p :id="`${id}-ayuda`" class="ayuda"><span v-if="aceptar">{{ aceptar }}</span><span v-if="aceptar && maximo"> · </span><span v-if="maximo">hasta {{ tamanoArchivo(maximo) }} cada uno</span></p>
    <ul v-if="rechazos.length" class="rechazos" role="alert"><li v-for="r in rechazos" :key="r">{{ r }}</li></ul>
    <ul v-if="archivos.length" class="lista">
      <li v-for="a in archivos" :key="a.id" class="fila" @keydown.delete="emit('quitar', a)">
        <Icono nombre="documento" :tam="18" class="ico" />
        <div class="datos">
          <p class="nombre"><span>{{ a.nombre }}</span><small>{{ tamanoArchivo(a.tamano) }}</small></p>
          <div v-if="a.estado === 'subiendo'" class="barra" role="progressbar" :aria-valuenow="Math.round(a.progreso ?? 0)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Subiendo ${a.nombre}`"><i :style="{ width: (a.progreso ?? 0) + '%' }"></i></div>
          <p v-if="a.estado === 'error' && a.error" class="falla">{{ a.error }}</p>
        </div>
        <span class="tag" :class="TONO[a.estado]">{{ TEXTO[a.estado] }}<template v-if="a.estado === 'subiendo' && a.progreso != null"> {{ Math.round(a.progreso) }} %</template></span>
        <button v-if="a.estado === 'error'" type="button" @click="emit('reintentar', a)">Reintentar</button>
        <button type="button" class="icono" :aria-label="`Quitar ${a.nombre}`" title="Quitar" @click="emit('quitar', a)"><Icono nombre="cerrar" :tam="16" /></button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.zona { display: grid; justify-items: center; gap: 6px; width: 100%; padding: 22px 16px; border: 1.5px dashed var(--borde-fuerte); background: none; color: var(--sub); }
.zona:hover:not(:disabled), .zona.sobre { border-color: var(--txt); background: color-mix(in srgb, var(--txt) 4%, transparent); color: var(--txt); }
.zona b { font-weight: 600; font-size: .86rem; }
.ayuda { margin: 6px 0 0; font: 600 .66rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--tenue); }
.rechazos { margin: 10px 0 0; padding: 8px 12px; list-style: none; border: 1px solid color-mix(in srgb, var(--error) 45%, transparent); background: color-mix(in srgb, var(--error) 16%, transparent); color: color-mix(in srgb, var(--error) 78%, var(--txt)); font-size: .84rem; }
.lista { margin: 12px 0 0; padding: 0; list-style: none; border: 1px solid var(--borde); }
.fila { display: flex; align-items: center; gap: 12px; padding: 10px 12px; }
.fila + .fila { border-top: 1px solid var(--borde); }
.ico { flex: none; color: var(--sub); }
.datos { flex: 1; min-width: 0; display: grid; gap: 6px; }
.nombre { display: flex; align-items: baseline; gap: 10px; margin: 0; min-width: 0; }
.nombre span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .86rem; }
.nombre small { flex: none; font: 500 .72rem var(--mono); color: var(--sub); }
.barra { height: 4px; background: var(--borde); }
.barra i { display: block; height: 100%; background: var(--txt); transition: width .12s; }
.falla { margin: 0; font-size: .78rem; color: color-mix(in srgb, var(--error) 78%, var(--txt)); }
.oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { .barra i { transition: none; } }
</style>
