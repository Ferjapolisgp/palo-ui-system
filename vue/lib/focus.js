import { nextTick, onBeforeUnmount, unref, watch } from 'vue';

// Foco y scroll de las capas modales (Overlay, Modal, Drawer). Mientras la capa está activa, Tab no sale de ella,
// el fondo no se desplaza y, al cerrarse, el foco vuelve a lo que la abrió. Con capas apiladas (un Modal abierto
// desde un Drawer) solo responde la de arriba.
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const pila = [];
let bloqueos = 0;
let estiloPrevio = '';

const enfocables = (el) => [...el.querySelectorAll(ENFOCABLES)].filter((e) => e.offsetParent !== null || e === document.activeElement);

function bloquearScroll(si) {
  if (si && bloqueos++ === 0) {
    const barra = innerWidth - document.documentElement.clientWidth;
    estiloPrevio = document.documentElement.getAttribute('style') ?? '';
    document.documentElement.style.overflow = 'hidden';
    if (barra > 0) document.documentElement.style.paddingRight = `${barra}px`; // sin salto al desaparecer la barra
  } else if (!si && --bloqueos === 0) {
    if (estiloPrevio) document.documentElement.setAttribute('style', estiloPrevio);
    else document.documentElement.removeAttribute('style');
  }
}

function tab(e) {
  const capa = pila.at(-1);
  if (e.key !== 'Tab' || !capa) return;
  const el = unref(capa.contenedor);
  if (!el) return;
  const lista = enfocables(el);
  if (!lista.length) { e.preventDefault(); el.focus(); return; }
  const [primero, ultimo] = [lista[0], lista.at(-1)];
  const dentro = el.contains(document.activeElement);
  if (e.shiftKey && (document.activeElement === primero || !dentro)) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && (document.activeElement === ultimo || !dentro)) { e.preventDefault(); primero.focus(); }
}

export function useFocusTrap(contenedor, activo, { scroll = true } = {}) {
  const capa = { contenedor, previo: null };

  async function activar() {
    capa.previo = document.activeElement;
    pila.push(capa);
    if (pila.length === 1) document.addEventListener('keydown', tab);
    if (scroll) bloquearScroll(true);
    await nextTick();
    const el = unref(contenedor);
    if (!el || el.contains(document.activeElement)) return;
    // Primero lo marcado con autofocus; si no, la caja del diálogo (así el lector anuncia su título).
    (el.querySelector('[autofocus]') ?? el.querySelector('[role="dialog"], [role="alertdialog"]') ?? el).focus();
  }

  function desactivar() {
    const i = pila.indexOf(capa);
    if (i < 0) return;
    pila.splice(i, 1);
    if (!pila.length) document.removeEventListener('keydown', tab);
    if (scroll) bloquearScroll(false);
    if (capa.previo?.isConnected) capa.previo.focus();
  }

  watch(() => unref(activo), (si) => (si ? activar() : desactivar()), { immediate: true });
  onBeforeUnmount(desactivar);

  return { esSuperior: () => pila.at(-1) === capa };
}
