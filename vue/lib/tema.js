// Tema de la interfaz: «sistema» (por defecto, sigue al sistema operativo), «claro» u «oscuro».
// Se guarda en este navegador. El mismo valor lo aplica un script en el <head> de Base.astro antes de pintar.
const CLAVE = 'tema';
const ATRIBUTO = { claro: 'light', oscuro: 'dark' };

export function leerTema() {
  try { return localStorage.getItem(CLAVE) || 'sistema'; } catch { return 'sistema'; }
}

export function aplicarTema(tema) {
  try { localStorage.setItem(CLAVE, tema); } catch { /* sin almacenamiento: vale solo esta visita */ }
  if (ATRIBUTO[tema]) document.documentElement.dataset.theme = ATRIBUTO[tema];
  else delete document.documentElement.dataset.theme;
}

// ─── Temas de marca (css/temas.css) ───────────────────────────────────────────
// aplicarMarca('naranja')                     un tema de la hoja; se recuerda en este navegador
// aplicarMarca({ senal: [claro, oscuro] })    un tema propio; no se recuerda (la app guarda su configuración)
// aplicarMarca(null)                          vuelve a la marca base
const CLAVE_MARCA = 'marca';
const PROPIAS = ['--senal', '--senal-txt', '--logo-fondo', '--tinte'];

const canales = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
};
const luz = (hex) => { const [r, g, b] = canales(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

// Contraste WCAG entre dos colores #rrggbb (4,5 o más para texto, 3 o más para íconos y bordes).
export function contraste(a, b) {
  const [x, y] = [luz(a), luz(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Texto que va sobre la señal: el que más contraste da entre el blanco y el oscuro de la interfaz.
export function textoSobre(hex) {
  return contraste(hex, '#ffffff') >= contraste(hex, '#14161a') ? '#ffffff' : '#14161a';
}

// Variables CSS de un tema propio: { senal: [claro, oscuro], tinte?: 0–60 }. Sirve para <html> o para una parte de la página.
export function variablesMarca({ senal, tinte = 35 }) {
  const [claro, oscuro] = senal;
  const ld = (c, o) => `light-dark(${c}, ${o})`;
  return {
    '--senal': ld(claro, oscuro),
    '--senal-txt': ld(textoSobre(claro), textoSobre(oscuro)),
    '--logo-fondo': ld(claro, oscuro),
    '--tinte': `${tinte}%`,
  };
}

export function leerMarca() {
  try { return localStorage.getItem(CLAVE_MARCA) || ''; } catch { return ''; }
}

export function aplicarMarca(marca) {
  const raiz = document.documentElement;
  PROPIAS.forEach((p) => raiz.style.removeProperty(p));
  const guardar = (v) => { try { v ? localStorage.setItem(CLAVE_MARCA, v) : localStorage.removeItem(CLAVE_MARCA); } catch { /* vale solo esta visita */ } };
  if (!marca) { delete raiz.dataset.marca; guardar(''); return; }
  if (typeof marca === 'string') { raiz.dataset.marca = marca; guardar(marca); return; }
  raiz.dataset.marca = 'propia'; guardar('');
  Object.entries(variablesMarca(marca)).forEach(([k, v]) => raiz.style.setProperty(k, v));
}
