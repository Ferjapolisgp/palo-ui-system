<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import Icono from './Icono.vue';
import { useFloating } from '../../lib/floating.js';
import { deIso, fechaLargaIso, finMes, formatoFecha, hoyIso, inicioMes, interpretarFecha, nombreMes, semanasDelMes, sumarDias, sumarMeses } from '../../lib/fechas.js';

// Fecha (o rango de fechas) sin hora, en ISO «AAAA-MM-DD». Se escribe a mano (28/10/2026, 28/10, 28-10-26)
// o se elige en el calendario, que se maneja entero con el teclado: flechas, Re Pág/Av Pág (mes; con Shift, año),
// Inicio/Fin (semana), Enter o espacio para elegir y Escape para cerrar. Alt+↓ en el campo lo abre. Semana de lunes a domingo.
// Con rango, el v-model es [desde, hasta] y el calendario pide dos clics; los atajos eligen rangos comunes.
const props = defineProps({
  modelValue: { type: [String, Array], default: null },
  rango: Boolean,
  min: String,
  max: String,
  atajos: { type: Boolean, default: true },
  etiqueta: String, // nombre del campo si no está dentro de un Field (con Field, el nombre lo da su etiqueta)
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue', 'invalida']);
const id = useId();
const nombre = computed(() => props.etiqueta ?? 'Fecha');

const desde = computed(() => (props.rango ? props.modelValue?.[0] ?? null : props.modelValue));
const hasta = computed(() => (props.rango ? props.modelValue?.[1] ?? null : null));
const fueraDeLimites = (iso) => (props.min && iso < props.min) || (props.max && iso > props.max);

// Texto de los campos: se reescribe con el valor salvo mientras la persona escribe.
const textoDesde = ref(formatoFecha(desde.value));
const textoHasta = ref(formatoFecha(hasta.value));
const invalidos = ref({ desde: false, hasta: false });
watch(() => props.modelValue, () => {
  textoDesde.value = formatoFecha(desde.value);
  textoHasta.value = formatoFecha(hasta.value);
  invalidos.value = { desde: false, hasta: false };
}, { deep: true });

function emitir(d, h) {
  if (!props.rango) return emit('update:modelValue', d);
  if (d && h && h < d) [d, h] = [h, d];
  emit('update:modelValue', d || h ? [d, h] : null);
}

function confirmarTexto(cual) {
  const texto = cual === 'desde' ? textoDesde.value : textoHasta.value;
  if (!texto.trim()) {
    invalidos.value[cual] = false;
    return cual === 'desde' ? emitir(null, hasta.value) : emitir(desde.value, null);
  }
  const iso = interpretarFecha(texto);
  if (!iso || fueraDeLimites(iso)) {
    invalidos.value[cual] = true;
    emit('invalida', { campo: cual, texto, motivo: iso ? 'fuera de los límites' : 'no es una fecha' });
    return;
  }
  invalidos.value[cual] = false;
  if (cual === 'desde') { textoDesde.value = formatoFecha(iso); emitir(iso, hasta.value); }
  else { textoHasta.value = formatoFecha(iso); emitir(desde.value, iso); }
}

// Calendario
const abierto = ref(false);
const caja = ref(null);
const panel = ref(null);
const boton = ref(null);
const { estilo, actualizar } = useFloating(caja, panel, { abierto, lado: 'abajo', alinear: 'inicio', separacion: 4 });
const enfocada = ref(hoyIso()); // día con el foco; define el mes que se ve
const eligiendoHasta = ref(false);
const sobre = ref(null); // día bajo el mouse mientras se elige el fin del rango
const semanas = computed(() => semanasDelMes(enfocada.value));
const DIAS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
const DIAS_LARGOS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const hoy = hoyIso();

function limitar(iso) {
  if (props.min && iso < props.min) return props.min;
  if (props.max && iso > props.max) return props.max;
  return iso;
}
async function abrir() {
  if (props.disabled) return;
  enfocada.value = limitar(desde.value ?? hoy);
  eligiendoHasta.value = false;
  abierto.value = true;
  await nextTick();
  actualizar(); // ubicarlo (y hacerlo visible) antes de enfocar: un elemento oculto no recibe el foco
  enfocarDia();
}
function cerrar(devolverFoco = true) {
  if (!abierto.value) return;
  abierto.value = false;
  sobre.value = null;
  if (devolverFoco) boton.value?.focus();
}
function enfocarDia() {
  panel.value?.querySelector(`[data-dia="${enfocada.value}"]`)?.focus();
}
async function mover(iso) {
  enfocada.value = limitar(iso);
  await nextTick();
  enfocarDia();
}

function elegir(iso) {
  if (fueraDeLimites(iso)) return;
  if (!props.rango) { emitir(iso); return cerrar(); }
  if (!eligiendoHasta.value) {
    emitir(iso, null);
    eligiendoHasta.value = true;
    enfocada.value = iso;
    return;
  }
  emitir(desde.value, iso);
  eligiendoHasta.value = false;
  cerrar();
}

function tecla(e) {
  const pasos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  const dia = (deIso(enfocada.value).getDay() + 6) % 7;
  if (e.key in pasos) mover(sumarDias(enfocada.value, pasos[e.key]));
  else if (e.key === 'PageUp') mover(sumarMeses(enfocada.value, e.shiftKey ? -12 : -1));
  else if (e.key === 'PageDown') mover(sumarMeses(enfocada.value, e.shiftKey ? 12 : 1));
  else if (e.key === 'Home') mover(sumarDias(enfocada.value, -dia));
  else if (e.key === 'End') mover(sumarDias(enfocada.value, 6 - dia));
  else return;
  e.preventDefault();
}

// Estado de cada día para el dibujo y para el lector de pantalla.
const enRango = (iso) => {
  const d = desde.value;
  const h = eligiendoHasta.value ? sobre.value : hasta.value;
  if (!props.rango || !d || !h) return false;
  const [a, b] = d < h ? [d, h] : [h, d];
  return iso > a && iso < b;
};
const esExtremo = (iso) => iso === desde.value || (props.rango && iso === hasta.value);
const etiquetaDia = (iso) => `${fechaLargaIso(iso)}${iso === hoy ? ', hoy' : ''}`;

// Atajos
const ATAJOS = computed(() => {
  if (!props.rango) return [['Hoy', () => hoy], ['Ayer', () => sumarDias(hoy, -1)]];
  const mesPasado = sumarMeses(hoy, -1);
  return [
    ['Hoy', () => [hoy, hoy]],
    ['Últimos 7 días', () => [sumarDias(hoy, -6), hoy]],
    ['Últimos 30 días', () => [sumarDias(hoy, -29), hoy]],
    ['Este mes', () => [inicioMes(hoy), hoy]],
    ['Mes anterior', () => [inicioMes(mesPasado), finMes(mesPasado)]],
  ];
});
function usarAtajo(calc) {
  const v = calc();
  if (props.rango) emitir(limitar(v[0]), limitar(v[1]));
  else emitir(limitar(v));
  cerrar();
}

// Cierre por clic afuera y Escape (en captura: si está dentro de un diálogo, cierra solo el calendario).
const fuera = (e) => { if (abierto.value && !caja.value?.contains(e.target) && !panel.value?.contains(e.target)) cerrar(false); };
const escape = (e) => { if (e.key === 'Escape' && abierto.value) { e.stopPropagation(); cerrar(); } };
onMounted(() => { document.addEventListener('pointerdown', fuera); document.addEventListener('keydown', escape, true); });
onBeforeUnmount(() => { document.removeEventListener('pointerdown', fuera); document.removeEventListener('keydown', escape, true); });
const abrirConTeclado = (e) => { if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); abrir(); } };
</script>

<template>
  <div class="datepicker">
    <div ref="caja" class="caja-control" :class="{ rango, disabled, invalida: invalidos.desde || invalidos.hasta }">
      <input v-model="textoDesde" type="text" inputmode="numeric" autocomplete="off" placeholder="dd/mm/aaaa" :disabled="disabled"
             :aria-label="rango ? `${nombre}: desde` : etiqueta" :aria-invalid="invalidos.desde || undefined"
             @blur="confirmarTexto('desde')" @keydown.enter.prevent="confirmarTexto('desde')" @keydown="abrirConTeclado">
      <template v-if="rango">
        <span class="separador" aria-hidden="true">–</span>
        <input v-model="textoHasta" type="text" inputmode="numeric" autocomplete="off" placeholder="dd/mm/aaaa" :disabled="disabled"
               :aria-label="`${nombre}: hasta`" :aria-invalid="invalidos.hasta || undefined"
               @blur="confirmarTexto('hasta')" @keydown.enter.prevent="confirmarTexto('hasta')" @keydown="abrirConTeclado">
      </template>
      <button ref="boton" type="button" class="abrir" :disabled="disabled" :aria-expanded="abierto" aria-haspopup="dialog" :aria-controls="`${id}-cal`"
              :aria-label="`Abrir calendario: ${nombre}`" title="Elegir en el calendario" @click="abierto ? cerrar() : abrir()">
        <Icono nombre="calendario" :tam="16" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="abierto" :id="`${id}-cal`" ref="panel" class="calendario" role="dialog" :aria-label="`Calendario: ${nombre}`" :style="estilo">
        <div v-if="atajos" class="atajos" role="group" aria-label="Atajos">
          <button v-for="[texto, calc] in ATAJOS" :key="texto" type="button" @click="usarAtajo(calc)">{{ texto }}</button>
        </div>
        <div class="mes">
          <div class="cabecera">
            <button type="button" class="icono" aria-label="Mes anterior" @click="mover(sumarMeses(enfocada, -1))"><Icono nombre="izquierda" :tam="16" /></button>
            <p class="nombre-mes" aria-live="polite">{{ nombreMes(enfocada) }}</p>
            <button type="button" class="icono" aria-label="Mes siguiente" @click="mover(sumarMeses(enfocada, 1))"><Icono nombre="derecha" :tam="16" /></button>
          </div>
          <p v-if="rango" class="paso">{{ eligiendoHasta ? 'Elegí la fecha final' : 'Elegí la fecha inicial' }}</p>
          <table role="grid" :aria-label="nombreMes(enfocada)" @keydown="tecla">
            <thead><tr><th v-for="(d, i) in DIAS" :key="d" scope="col"><abbr :title="DIAS_LARGOS[i]">{{ d }}</abbr></th></tr></thead>
            <tbody @mouseleave="sobre = null">
              <tr v-for="(semana, s) in semanas" :key="s">
                <td v-for="iso in semana" :key="iso" :class="{ 'en-rango': enRango(iso), extremo: esExtremo(iso) }">
                  <button type="button" class="dia" :data-dia="iso" :tabindex="iso === enfocada ? 0 : -1"
                          :class="{ otro: iso.slice(0, 7) !== enfocada.slice(0, 7), hoy: iso === hoy }"
                          :aria-label="etiquetaDia(iso)" :aria-pressed="esExtremo(iso)" :disabled="fueraDeLimites(iso)"
                          @click="elegir(iso)" @mouseenter="sobre = iso" @focus="enfocada = iso; sobre = iso">{{ Number(iso.slice(8)) }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.datepicker { min-width: 0; }
.caja-control { display: flex; align-items: center; gap: 4px; padding-right: 3px; border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); background: var(--panel-2); }
.caja-control:focus-within { outline: 2px solid var(--senal); outline-offset: 2px; }
.caja-control.invalida { border-color: var(--error); }
.caja-control input { flex: 1; min-width: 0; width: 10ch; border: 0; background: none; font: 500 .88rem var(--mono); }
.caja-control input:focus-visible { outline: none; }
.caja-control input[aria-invalid] { color: var(--error); }
.separador { color: var(--sub); }
.abrir { display: inline-grid; place-items: center; width: 30px; height: 30px; padding: 0; border-color: transparent; background: none; color: var(--sub); }
.abrir:hover, .abrir[aria-expanded="true"] { color: var(--txt); border-color: var(--borde-fuerte); }
.disabled { opacity: .55; }

.calendario { z-index: var(--capa-flotante); display: flex; gap: 0; background: var(--panel); border: 1px solid var(--borde-fuerte); border-radius: var(--r-md); box-shadow: var(--sombra-2); }
.atajos { display: grid; align-content: start; gap: 2px; padding: 10px 8px; border-right: 1px solid var(--borde); }
.atajos button { padding: 6px 10px; border: 0; background: none; text-align: left; white-space: nowrap; font-size: .84rem; color: var(--txt); }
.atajos button:hover { background: var(--panel-2); }
.mes { padding: 10px 12px 12px; }
.cabecera { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.nombre-mes { margin: 0; font-weight: 700; }
.paso { margin: 4px 0 0; font-size: .76rem; color: var(--sub); text-align: center; }
table { border-collapse: separate; border-spacing: 0 2px; margin-top: 6px; }
th { width: 36px; height: 26px; font: 600 .64rem var(--mono); text-transform: uppercase; color: var(--sub); }
abbr { text-decoration: none; }
td { padding: 0; }
.dia { display: grid; place-items: center; width: 36px; height: 32px; padding: 0; border: 1px solid transparent; border-radius: var(--r-sm); background: none; font: 500 .84rem var(--mono); color: var(--txt); }
.dia:hover:not(:disabled) { border-color: var(--borde-fuerte); }
.dia.otro { color: var(--tenue); }
.dia.hoy { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
.dia:disabled { opacity: .3; text-decoration: line-through; }
td.en-rango { background: color-mix(in srgb, var(--senal) 16%, transparent); }
td.extremo .dia { background: var(--senal); border-color: var(--senal); color: var(--senal-txt); font-weight: 700; }
@media (max-width: 520px) {
  .calendario { flex-direction: column; }
  .atajos { display: flex; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--borde); }
}
</style>
