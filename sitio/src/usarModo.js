import { onBeforeUnmount, onMounted, ref } from 'vue';
import { aplicarTema } from 'palo-ui-system';

// Tema efectivo ('claro' | 'oscuro'): el elegido con aplicarTema() o, si no hay, el del sistema operativo.
const efectivo = () => {
  const t = document.documentElement.dataset.theme;
  if (t) return t === 'light' ? 'claro' : 'oscuro';
  return matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
};

export function cambiarModo() {
  aplicarTema(efectivo() === 'oscuro' ? 'claro' : 'oscuro');
}

// Ref que sigue el tema; `alCambiar` corre después de cada cambio (por ejemplo, para releer los tokens).
export function usarModo(alCambiar) {
  const modo = ref(efectivo());
  const actualizar = () => { modo.value = efectivo(); alCambiar?.(); };
  const mo = new MutationObserver(actualizar);
  const mq = matchMedia('(prefers-color-scheme: light)');
  onMounted(() => { mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); mq.addEventListener('change', actualizar); alCambiar?.(); });
  onBeforeUnmount(() => { mo.disconnect(); mq.removeEventListener('change', actualizar); });
  return modo;
}

// Valores actuales de una lista de tokens, para mostrarlos en las muestras de color.
export function usarTokens(nombres) {
  const valores = ref({});
  const leer = () => {
    const cs = getComputedStyle(document.documentElement);
    valores.value = Object.fromEntries(nombres.map((n) => [n, cs.getPropertyValue(`--${n}`).trim()]));
  };
  usarModo(leer);
  return valores;
}
