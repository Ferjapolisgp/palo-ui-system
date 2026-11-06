<script setup>
import { computed, nextTick, ref, useId, watch } from 'vue';
import Icono from './Icono.vue';
import Overlay from './Overlay.vue';

// Buscador global de acciones y destinos (⌘ K). Muestra lo que recibe: no conoce rutas ni acciones.
// El atajo global lo registra la app; acá solo se maneja el teclado mientras está abierta.
// comandos: [{ valor, texto, grupo?, icono?, atajo?, palabras? }]; `palabras` suma términos que también buscan.
// v-model:abierta. Eventos: ejecutar(comando) (la paleta se cierra sola).
// Teclado: escribir filtra (sin distinguir acentos ni mayúsculas), ↑ ↓ recorren, Inicio y Fin saltan, Enter ejecuta, Escape cierra.
const props = defineProps({
  abierta: Boolean,
  comandos: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Buscá una acción o una pantalla' },
  etiqueta: { type: String, default: 'Paleta de comandos' },
});
const emit = defineEmits(['update:abierta', 'ejecutar']);

const id = useId();
const texto = ref('');
const activo = ref(0);
const lista = ref(null);
const plano = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const resultados = computed(() => {
  const q = plano(texto.value).trim();
  const ok = props.comandos.filter((c) => !q || q.split(/\s+/).every((p) => plano(`${c.texto} ${c.grupo ?? ''} ${c.palabras ?? ''}`).includes(p)));
  return ok;
});
// Secciones por grupo, conservando el orden de aparición; `i` es la posición en la lista plana.
const secciones = computed(() => {
  const por = new Map();
  resultados.value.forEach((c, i) => {
    const g = c.grupo ?? '';
    if (!por.has(g)) por.set(g, []);
    por.get(g).push({ ...c, i });
  });
  return [...por].map(([grupo, items]) => ({ grupo, items }));
});

watch(() => props.abierta, (si) => { if (si) { texto.value = ''; activo.value = 0; } });
watch(texto, () => { activo.value = 0; });
watch(activo, async () => {
  await nextTick();
  lista.value?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
});

const cerrar = () => emit('update:abierta', false);
function ejecutar(c) {
  if (!c) return;
  emit('ejecutar', c);
  cerrar();
}
function teclas(e) {
  const n = resultados.value.length;
  if (e.key === 'ArrowDown' && n) { e.preventDefault(); activo.value = (activo.value + 1) % n; }
  else if (e.key === 'ArrowUp' && n) { e.preventDefault(); activo.value = (activo.value - 1 + n) % n; }
  else if (e.key === 'Home' && n) { e.preventDefault(); activo.value = 0; }
  else if (e.key === 'End' && n) { e.preventDefault(); activo.value = n - 1; }
  else if (e.key === 'Enter') { e.preventDefault(); ejecutar(resultados.value[activo.value]); }
}
</script>

<template>
  <Overlay :abierto="abierta" @cerrar="cerrar">
    <div class="paleta encuadre" role="dialog" aria-modal="true" :aria-label="etiqueta">
      <div class="busca">
        <Icono nombre="buscar" :tam="16" />
        <input v-model="texto" type="text" role="combobox" autocomplete="off" aria-expanded="true" :aria-controls="`${id}-lista`" :aria-activedescendant="resultados.length ? `${id}-${activo}` : undefined"
               :placeholder="placeholder" :aria-label="placeholder" @keydown="teclas">
        <kbd class="atajo">Esc</kbd>
      </div>
      <div :id="`${id}-lista`" ref="lista" class="resultados" role="listbox" :aria-label="etiqueta">
        <template v-for="s in secciones" :key="s.grupo">
          <p v-if="s.grupo" class="grupo" role="presentation">{{ s.grupo }}</p>
          <div v-for="c in s.items" :id="`${id}-${c.i}`" :key="c.valor" role="option" class="op" :class="{ on: c.i === activo }" :aria-selected="c.i === activo"
               @mousemove="activo = c.i" @click="ejecutar(c)">
            <Icono v-if="c.icono" :nombre="c.icono" :tam="16" />
            <span class="op-txt">{{ c.texto }}</span>
            <kbd v-if="c.atajo" class="atajo">{{ c.atajo }}</kbd>
          </div>
        </template>
        <p v-if="!resultados.length" class="nada" role="status">No hay coincidencias. Probá con otra palabra.</p>
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
.paleta { position: relative; display: grid; grid-template-rows: auto minmax(0, 1fr); width: 100%; max-width: 560px; max-height: min(460px, calc(100dvh - 32px)); background: var(--panel); border: 1px solid var(--borde-fuerte); box-shadow: var(--sombra-2); }
.busca { display: flex; align-items: center; gap: 10px; padding: 0 14px; border-bottom: 1px solid var(--borde); color: var(--sub); }
.busca input { flex: 1; min-width: 0; padding: 14px 0; border: 0; background: none; outline: none; font-size: .95rem; color: var(--txt); }
.resultados { overflow-y: auto; padding: 6px; }
.grupo { margin: 8px 8px 4px; font: 600 .62rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--tenue); }
.op { display: flex; align-items: center; gap: 10px; padding: 9px 10px; color: var(--sub); cursor: pointer; }
.op.on { background: color-mix(in srgb, var(--txt) 7%, transparent); color: var(--txt); }
.op-txt { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .88rem; }
.nada { margin: 0; padding: 22px 12px; text-align: center; color: var(--sub); font-size: .86rem; }
</style>
