import { nextTick, onBeforeUnmount, ref, unref, watch } from 'vue';

// Ubica un elemento flotante (menú, ayuda, popover) junto a su ancla con position: fixed.
// Va teletransportado al <body>, así ningún overflow: hidden lo recorta. Si no entra del lado pedido
// se da vuelta, y nunca sale de la ventana. Se recalcula con scroll, cambio de tamaño y cambios del contenido.
const OPUESTO = { abajo: 'arriba', arriba: 'abajo', derecha: 'izquierda', izquierda: 'derecha' };
const MARGEN = 8;
const elemento = (r) => { const v = unref(r); return v?.$el ?? v; };

function ubicar(a, f, lado, alinear, sep) {
  const vertical = lado === 'abajo' || lado === 'arriba';
  const eje = (inicio, largo, propio) => alinear === 'centro' ? inicio + largo / 2 - propio / 2 : alinear === 'fin' ? inicio + largo - propio : inicio;
  if (vertical) return { top: lado === 'abajo' ? a.bottom + sep : a.top - sep - f.height, left: eje(a.left, a.width, f.width) };
  return { left: lado === 'derecha' ? a.right + sep : a.left - sep - f.width, top: eje(a.top, a.height, f.height) };
}

function entra(p, f, lado) {
  if (lado === 'abajo') return p.top + f.height <= innerHeight - MARGEN;
  if (lado === 'arriba') return p.top >= MARGEN;
  if (lado === 'derecha') return p.left + f.width <= innerWidth - MARGEN;
  return p.left >= MARGEN;
}

const limitar = (v, min, max) => Math.max(min, Math.min(v, max));

export function useFloating(ancla, flotante, { abierto, lado = 'abajo', alinear = 'inicio', separacion = 6 } = {}) {
  // Oculto hasta la primera medición: así no aparece un instante en la esquina.
  const estilo = ref({ position: 'fixed', top: '0px', left: '0px', visibility: 'hidden' });
  const ladoFinal = ref(unref(lado));
  let observador;

  function actualizar() {
    const a = elemento(ancla)?.getBoundingClientRect();
    const el = elemento(flotante);
    if (!a || !el) return;
    const f = { width: el.offsetWidth, height: el.offsetHeight };
    let l = unref(lado);
    let p = ubicar(a, f, l, unref(alinear), separacion);
    if (!entra(p, f, l)) {
      const q = ubicar(a, f, OPUESTO[l], unref(alinear), separacion);
      if (entra(q, f, OPUESTO[l])) { l = OPUESTO[l]; p = q; }
    }
    const top = limitar(p.top, MARGEN, Math.max(MARGEN, innerHeight - f.height - MARGEN));
    const left = limitar(p.left, MARGEN, Math.max(MARGEN, innerWidth - f.width - MARGEN));
    estilo.value = { position: 'fixed', top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, visibility: 'visible' };
    // También directo en el elemento: el render llega un tick después y quien abre puede querer enfocarlo ya.
    Object.assign(el.style, estilo.value);
    ladoFinal.value = l;
  }

  function escuchar(si) {
    const metodo = si ? 'addEventListener' : 'removeEventListener';
    window[metodo]('scroll', actualizar, { capture: true, passive: true });
    window[metodo]('resize', actualizar);
    observador?.disconnect();
    observador = undefined;
    if (si && typeof ResizeObserver !== 'undefined') {
      observador = new ResizeObserver(actualizar);
      [elemento(ancla), elemento(flotante)].forEach((el) => el && observador.observe(el));
    }
  }

  watch(() => unref(abierto), async (si) => {
    if (!si) {
      escuchar(false);
      estilo.value = { ...estilo.value, visibility: 'hidden' };
      return;
    }
    await nextTick();
    actualizar();
    escuchar(true);
  }, { immediate: true });
  onBeforeUnmount(() => escuchar(false));

  return { estilo, lado: ladoFinal, actualizar };
}
