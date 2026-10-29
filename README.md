# palo-ui-system · Palo UI

Sistema visual de las herramientas internas de Palo (Pay, Docs, Onboarding, la Ticketera y las que vengan): tokens, estilos base y componentes Vue 3 (interfaz y gráficos). Parte de la identidad «marcado técnico» de la Ticketera, con la marca **Cardón**: fondos grafito, violeta como señal y el cardón verde como logo. **Este repo es el origen de verdad**: los cambios de tokens y componentes se hacen aquí.

**Documentación:** el sitio en [`sitio/`](sitio/) consume la librería tal como lo haría cualquier app, con demos vivas, código y API de cada componente:

```bash
cd sitio
npm install
npm run dev        # http://localhost:5173
npm run build      # genera sitio/dist, publicable en cualquier hosting estático
```

Guía de diseño (principios y decisiones): [`docs/sistema-visual.md`](docs/sistema-visual.md). Catálogo de tokens: [`docs/tokens.md`](docs/tokens.md). Vista solo-CSS sin build: [`demo.html`](demo.html).

## Contenido

| Ruta | Qué es | Depende de |
|---|---|---|
| `css/tokens.css` | Variables (`--bg`, `--senal`, `--ok`, `--serie-1`…), tema oscuro y claro, `@font-face` | nada |
| `css/base.css` | Reset, formularios, botones, `.tag`, `.tabla-simple`, `.titulo-pagina`… | tokens |
| `css/palo-ui-system.css` | Importa los dos anteriores | — |
| `fonts/` | Inter y JetBrains Mono (variables, latín), ver `LICENCIAS.md` | — |
| `vue/components/ui/` | Interfaz: `BarraLateral`, `CabeceraPagina`, `BarraHerramientas`, `Desplegable`, `Paginacion`, `Tarjeta`, `Indicador`, `Aviso`, `Notificaciones`, `Confirmar`, `Vacio`, `Interruptor`, `Avatar`, `Marca`, `Icono`, `BarraUso`, `GrillaCupos`, `CodigoVerificacion`, `ConfigurarMfa`; datos: `DataTable`, `Descriptions`, `Skeleton`, `Spin`, `ProfileCard`, `ActionCard`; formularios: `Field`, `CurrencyInput`, `DatePicker`; capas: `Overlay`, `Modal`, `Drawer`, `Tooltip`, `Popover` | tokens, Vue |
| `vue/components/graficos/` | `GraficoLinea`, `GraficoBarras`, `GraficoComposicion`, `GraficoRadar`, `GraficoTope` (con leyenda, tooltip y «Ver tabla») | tokens, Vue |
| `vue/lib/` | `tema.js`, `notificaciones.js` (`notificar()`), `graficos.js` (escalas y formatos es-AR), `iconos.js`, `formato.js`, `mfa.js`; `fechas.js` (fechas ISO sin hora: `interpretarFecha`, `formatoFecha`…), `montos.js` (`interpretarMonto`), `floating.js` (`useFloating`: menús y ayudas al `<body>`, sin recortes) y `focus.js` (`useFocusTrap`: foco atrapado y scroll bloqueado en capas apiladas) | — |
| `vue/components/` (dominio ticket) | `EstadoTag`, `PrioridadMarca`, `BandaAdvertencia`, `MedidorFlujo`, `VenceTicket`, `AccionesFlujo`, `ReasignarModal`, `CodigoTicket` y `lib/flujo.js`, `visual.js`, `estados.js` | tokens, Vue |

Los componentes de dominio ticket vienen de la Ticketera: sirven si la herramienta maneja ese ciclo de vida, o como modelo. No están documentados en el sitio.

## Usarlo

**Solo CSS (cualquier framework o HTML plano):**

```html
<link rel="stylesheet" href="palo-ui-system/css/palo-ui-system.css">
```

Los `url()` de las fuentes son relativos a `css/`, así que la carpeta `fonts/` debe quedar junto a `css/`. Tema: automático según el sistema; forzarlo con `aplicarTema('claro' | 'oscuro' | 'sistema')`, que pone `data-theme` en `<html>` y lo recuerda.

**Vue 3 con Vite/Astro:**

```bash
npm install ../palo-ui-system       # o: "palo-ui-system": "file:../palo-ui-system"
```

```js
import 'palo-ui-system/css';
import { BarraLateral, BarraHerramientas, GraficoLinea, notificar } from 'palo-ui-system';
```

Si la app y la librería están en carpetas hermanas, agregá `resolve: { dedupe: ['vue'] }` en la configuración de Vite para que usen el mismo Vue (ver `sitio/vite.config.js`).

## Reglas mínimas (resumen; detalle en el sitio)

1. La señal (`--senal`, violeta) es de la interfaz (acción principal, activo, foco), nunca de los datos. El verde del logo (`--logo-*`) es solo de marca.
2. Nada de colores, tamaños, sombras ni capas (`z-index`) escritos a mano: siempre un token (`--capa-panel`, `--capa-modal`, `--capa-aviso`, `--capa-flotante`).
3. El color nunca es el único aviso: va con texto o forma.
4. Códigos y etiquetas en monoespaciada, mayúsculas, estampados.
5. Gráficos: series en el orden fijo `--serie-1…4`, un solo eje, `descripcion` obligatoria y «Ver tabla».

## Al cambiar algo

Cada cambio de token o componente se refleja en el sitio (`sitio/src/demos/` y `sitio/src/datos/componentes.js`) y, si cambia una decisión, en `docs/sistema-visual.md`. Los textos están en español.
