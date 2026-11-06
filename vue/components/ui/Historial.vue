<script setup>
import { computed } from 'vue';
import { fechaLargaIso } from '../../lib/fechas.js';
import Icono from './Icono.vue';
import Skeleton from './Skeleton.vue';

// Registro de eventos de una pieza (cambios de estado, versiones, firmas, movimientos), con quién, qué y cuándo.
// No consulta nada ni edita eventos: muestra lo que recibe y avisa con `mas` si la app pagina.
// eventos: [{ id, titulo, texto?, fecha, autor?, codigo?, tono?, icono? }]; fecha: 'AAAA-MM-DD' o 'AAAA-MM-DDTHH:mm'.
// tono: 'ok' | 'aviso' | 'error' | 'info'. Cada tono lleva su ícono: el color nunca va solo.
// agrupar muestra un título por día. Slot `evento` ({ evento }) reemplaza el contenido de cada fila.
const props = defineProps({
  eventos: { type: Array, default: () => [] },
  orden: { type: String, default: 'reciente' }, // 'reciente' | 'antiguo'
  agrupar: Boolean,
  cargando: Boolean,
  hayMas: Boolean,
  etiqueta: { type: String, default: 'Historial' },
});
const emit = defineEmits(['mas']);

const ICONO_TONO = { ok: 'ok', aviso: 'alerta', error: 'error', info: 'info' };
const dia = (f) => String(f).slice(0, 10);
const hora = (f) => (String(f).length > 10 ? String(f).slice(11, 16) : '');
const fechaCorta = (f) => `${dia(f).slice(8, 10)}/${dia(f).slice(5, 7)}/${dia(f).slice(0, 4)}`;
const ordenados = computed(() => [...props.eventos].sort((a, b) => (String(a.fecha) < String(b.fecha) ? 1 : -1) * (props.orden === 'reciente' ? 1 : -1)));
// Con agrupar, una lista de { dia, eventos }; sin agrupar, un solo grupo sin título.
const grupos = computed(() => {
  if (!props.agrupar) return [{ dia: '', eventos: ordenados.value }];
  const por = new Map();
  for (const e of ordenados.value) {
    const d = dia(e.fecha);
    if (!por.has(d)) por.set(d, []);
    por.get(d).push(e);
  }
  return [...por].map(([d, eventos]) => ({ dia: d, eventos }));
});
</script>

<template>
  <section class="historial" :aria-label="etiqueta" :aria-busy="cargando || undefined">
    <Skeleton v-if="cargando" :lineas="4" etiqueta="Cargando historial…" />
    <p v-else-if="!eventos.length" class="vacio">Todavía no hay movimientos.</p>
    <template v-else>
      <div v-for="g in grupos" :key="g.dia" class="grupo">
        <h3 v-if="g.dia" class="dia">{{ fechaLargaIso(g.dia) }}</h3>
        <ol class="lista">
          <li v-for="e in g.eventos" :key="e.id ?? e.fecha + e.titulo" class="evento" :class="e.tono && `tono-${e.tono}`">
            <span class="marca" aria-hidden="true"><Icono v-if="e.icono || ICONO_TONO[e.tono]" :nombre="e.icono || ICONO_TONO[e.tono]" :tam="13" /></span>
            <div class="cuerpo">
              <slot name="evento" :evento="e">
                <p class="linea"><b>{{ e.titulo }}</b><span v-if="e.codigo" class="codigo">{{ e.codigo }}</span></p>
                <p v-if="e.texto" class="texto">{{ e.texto }}</p>
                <p class="meta"><span v-if="e.autor">{{ e.autor }} · </span><time :datetime="e.fecha" :title="fechaCorta(e.fecha) + (hora(e.fecha) ? ' ' + hora(e.fecha) : '')">{{ agrupar ? hora(e.fecha) || fechaCorta(e.fecha) : fechaCorta(e.fecha) + (hora(e.fecha) ? ' · ' + hora(e.fecha) : '') }}</time></p>
              </slot>
            </div>
          </li>
        </ol>
      </div>
      <button v-if="hayMas" type="button" class="mas" @click="emit('mas')">Ver más movimientos</button>
    </template>
  </section>
</template>

<style scoped>
.grupo + .grupo { margin-top: 18px; }
.dia { margin: 0 0 8px; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.lista { position: relative; margin: 0; padding: 0; list-style: none; }
.evento { --c: var(--tenue); position: relative; display: flex; gap: 12px; padding-bottom: 16px; }
.evento:not(:last-child)::before { content: ""; position: absolute; top: 24px; bottom: 0; left: 11px; width: 1px; background: var(--borde); }
.marca { flex: none; display: grid; place-items: center; width: 23px; height: 23px; border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); background: color-mix(in srgb, var(--c) 16%, var(--panel)); color: color-mix(in srgb, var(--c) 78%, var(--txt)); }
.tono-ok { --c: var(--ok); } .tono-aviso { --c: var(--aviso); } .tono-error { --c: var(--error); } .tono-info { --c: var(--info); }
.cuerpo { min-width: 0; flex: 1; }
.cuerpo p { margin: 0; }
.linea { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: .86rem; }
.codigo { font: 600 .7rem var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--sub); }
.texto { margin-top: 2px; font-size: .84rem; color: var(--sub); }
.meta { margin-top: 2px; font-size: .74rem; color: var(--tenue); font-variant-numeric: tabular-nums; }
.vacio { margin: 0; color: var(--sub); }
.mas { margin-top: 4px; }
</style>
