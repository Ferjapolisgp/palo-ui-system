// Fechas sin hora en formato ISO «AAAA-MM-DD», siempre en hora local: un día es un día, sin corrimientos
// por zona horaria. Es el formato que usan DatePicker y lo que conviene mandar al servidor.

const dos = (n) => String(n).padStart(2, '0');

export const aIso = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;

export function deIso(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

export const hoyIso = () => aIso(new Date());

export function sumarDias(iso, n) {
  const d = deIso(iso);
  d.setDate(d.getDate() + n);
  return aIso(d);
}

export function sumarMeses(iso, n) {
  const d = deIso(iso);
  const dia = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  // 31/01 + 1 mes = 28/02 (o 29), no 03/03.
  d.setDate(Math.min(dia, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return aIso(d);
}

export const inicioMes = (iso) => `${iso.slice(0, 8)}01`;
export const finMes = (iso) => { const d = deIso(iso); return aIso(new Date(d.getFullYear(), d.getMonth() + 1, 0)); };

// «2026-10-28» → «28/10/2026»
export const formatoFecha = (iso) => (deIso(iso) ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');

// Lo que escribe una persona → ISO, o null si no es una fecha válida.
// Acepta 28/10/2026, 28-10-26, 28.10.2026, 28/10 (año actual) y también 2026-10-28.
export function interpretarFecha(texto) {
  const t = (texto ?? '').trim();
  if (!t) return null;
  if (deIso(t)) return t;
  const m = /^(\d{1,2})[/.\-\s](\d{1,2})(?:[/.\-\s](\d{2}|\d{4}))?$/.exec(t);
  if (!m) return null;
  const anio = !m[3] ? new Date().getFullYear() : m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  const d = new Date(anio, Number(m[2]) - 1, Number(m[1]));
  // Descarta lo que JavaScript «corrige» solo, como 31/02.
  return d.getDate() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 ? aIso(d) : null;
}

// Semanas de un mes para el calendario: 6 filas de lunes a domingo, con días del mes anterior y siguiente.
export function semanasDelMes(iso) {
  const primero = deIso(inicioMes(iso));
  const desfase = (primero.getDay() + 6) % 7; // lunes = 0
  const inicio = aIso(new Date(primero.getFullYear(), primero.getMonth(), 1 - desfase));
  return Array.from({ length: 6 }, (_, s) => Array.from({ length: 7 }, (_, d) => sumarDias(inicio, s * 7 + d)));
}

// «Octubre de 2026»: mayúscula solo al principio (text-transform: capitalize daría «Octubre De 2026»).
export const nombreMes = (iso) => { const t = deIso(iso).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }); return t[0].toUpperCase() + t.slice(1); };
export const fechaLargaIso = (iso) => deIso(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
