// Montos escritos por personas → número. El último separador (punto o coma) seguido de 1 o 2 dígitos es el decimal;
// los demás son de miles. Un único punto seguido de 3 dígitos se toma como miles («1.500» = mil quinientos),
// como se escribe en Argentina. Acepta «$ 1.234,56», «1234,5», «1234.56» y «1,234.56». Vacío o sin dígitos → null.
export function interpretarMonto(texto) {
  const limpio = String(texto ?? '').replace(/[^\d.,-]/g, '');
  if (!/\d/.test(limpio)) return null;
  const negativo = limpio.startsWith('-');
  const sinSigno = limpio.replace(/-/g, '');
  const ultimo = Math.max(sinSigno.lastIndexOf(','), sinSigno.lastIndexOf('.'));
  let entero = sinSigno;
  let decimal = '';
  if (ultimo >= 0) {
    const despues = sinSigno.slice(ultimo + 1);
    const soloPuntos = !sinSigno.includes(',');
    const esMiles = soloPuntos && (despues.length === 3 || (sinSigno.match(/\./g) || []).length > 1);
    if (!esMiles && despues.length < 3) { entero = sinSigno.slice(0, ultimo); decimal = despues; }
  }
  const n = Number(`${entero.replace(/[.,]/g, '') || '0'}.${decimal || '0'}`);
  return Number.isFinite(n) ? (negativo ? -n : n) : null;
}
