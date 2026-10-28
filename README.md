# palo-ui-system · sistema visual «marcado técnico»

Paquete con la identidad visual «marcado técnico» (nacida en la Ticketera) para reutilizarla en otras herramientas: tokens, estilos base y componentes Vue 3. **Este repo es el origen de verdad**: los cambios de tokens y componentes se hacen aquí.

Guía de diseño completa (principios, reglas, decisiones): [`docs/sistema-visual.md`](docs/sistema-visual.md). Catálogo de tokens: [`docs/tokens.md`](docs/tokens.md). Vista previa sin build: abrí [`demo.html`](demo.html) en el navegador.

## Contenido

| Ruta | Qué es | Depende de |
|---|---|---|
| `css/tokens.css` | Variables (`--bg`, `--senal`, `--ok`…), tema oscuro y claro, `@font-face` | nada |
| `css/base.css` | Reset, formularios, botones, `.tag`, `.tabla-simple`, `.titulo-pagina`… | tokens |
| `css/palo-ui-system.css` | Importa los dos anteriores | — |
| `fonts/` | Inter y JetBrains Mono (variables, latín), ver `LICENCIAS.md` | — |
| `vue/components/ui/` | Componentes Vue 3: `Desplegable`, `Avatar`, `Marca`, `Confirmar`, `CabeceraPagina`, `EstadoTag`, `PrioridadMarca`, `BandaAdvertencia`, `MedidorFlujo`, `VenceTicket`, `AccionesFlujo`, `ReasignarModal` | tokens, Vue |
| `vue/lib/` | Lógica pura de los componentes de ticket (`flujo.js`, `visual.js`, `estados.js`), formato (`formato.js`), `tema.js` | — |

Genéricos (sirven en cualquier herramienta): CSS completo, `Desplegable`, `Avatar`, `Marca`, `Confirmar`, `CabeceraPagina`. Propios del dominio ticket (estados, prioridades, flujo): el resto; se reusan si la otra herramienta maneja el mismo ciclo de vida, o se toman como ejemplo de cómo construir con los tokens.

## Usarlo

**Solo CSS (cualquier framework o HTML plano):**

```html
<link rel="stylesheet" href="palo-ui-system/css/palo-ui-system.css">
```

Los `url()` de las fuentes son relativos a `css/`, así que la carpeta `fonts/` debe quedar junto a `css/`. Tema: automático según el sistema; forzarlo con `<html data-theme="light|dark">` (`aplicarTema()` de `vue/lib/tema.js` lo guarda).

**Vue 3 con Vite/Astro:**

```bash
npm install ./ruta/a/palo-ui-system       # o: "palo-ui-system": "file:../palo-ui-system"
```

```js
import 'palo-ui-system/css';
import { Desplegable, EstadoTag, Marca } from 'palo-ui-system';
```

Los componentes usan solo tokens CSS: cambiar la marca de otra herramienta es redefinir variables (`--senal`, `--bg`…), no tocar componentes.

## Reglas mínimas (resumen; detalle en la guía)

1. El amarillo señal (`--senal`) es de la interfaz (acción principal, activo, foco), nunca de los datos.
2. Nada de colores, tamaños ni sombras escritos a mano: siempre un token.
3. El color nunca es el único aviso: va con texto o forma.
4. Códigos y etiquetas en monoespaciada, mayúsculas, estampados.

## Acoplamientos a tener en cuenta

- `vue/lib/formato.js` solo tiene funciones puras (`duracion`, `vencimiento`, `iniciales`, `TERMINADOS`); el cliente HTTP de la Ticketera no se trajo.
- Los textos están en español.
