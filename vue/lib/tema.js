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
