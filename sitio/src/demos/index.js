// Cada demo es un .vue real: se monta el componente y se muestra su código fuente tal cual (?raw),
// así lo que se ve y lo que se copia nunca se desfasan.
const componentes = import.meta.glob('./*/*.vue', { eager: true, import: 'default' });
const fuentes = import.meta.glob('./*/*.vue', { eager: true, query: '?raw', import: 'default' });

export function demosDe(id) {
  return Object.keys(componentes)
    .filter((ruta) => ruta.startsWith(`./${id}/`))
    .sort()
    .map((ruta) => ({ archivo: ruta.split('/').pop().replace('.vue', ''), componente: componentes[ruta], fuente: fuentes[ruta] }));
}
