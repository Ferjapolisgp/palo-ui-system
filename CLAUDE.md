# CLAUDE.md

Estatutos de **palo-ui-system** (Palo UI): qué es el proyecto, qué no se negocia y cómo se cambia. Vale para personas y para Claude Code. Si algo de acá contradice otro documento, manda este hasta que se corrija el otro.

## 1. Qué es

Sistema visual único de las herramientas internas de Palo: **Ticketera, Palo Docs, Palo Onboarding, PaloPay** y las que vengan. Tokens CSS, estilos base y componentes Vue 3 (interfaz y gráficos), más un sitio de documentación que consume la librería como lo haría cualquier app.

- **Este repo es el origen de verdad.** Las apps no copian ni retocan componentes: si les falta algo, se agrega acá.
- La identidad nace en la Ticketera ([ADR-010](../ticketera/docs/decisiones/ADR-010-identidad-y-sistema-visual.md), «marcado técnico») y se conserva al crecer a otros productos.

## 2. Comandos

No hay build ni tests de la librería: se publica como código fuente (`package.json` → `exports`). Se valida compilando el sitio.

```bash
cd sitio
npm install
npm run dev      # http://localhost:5173
npm run build    # sitio/dist; si compila, la librería compila
```

Las apps la instalan con `npm install ../palo-ui-system` y `resolve: { dedupe: ['vue'] }` en Vite.

## 3. Mapa

| Ruta | Qué |
|---|---|
| `css/tokens.css` | **Único lugar con valores**: colores (oscuro y claro), series, radios, sombras, capas, fuentes |
| `css/base.css` | Reset y piezas solo-CSS: `button`, `.primario`, `.peligro`, `.icono`, campos, `.tag`, `.tabla-simple`, `.titulo-pagina`, `.etiqueta-seccion`, `.encuadre`, `.marco-corte`, `.trama`, `.calca`, `.atajo` |
| `vue/components/ui/` | Interfaz genérica |
| `vue/components/graficos/` | Gráficos SVG propios (sin librerías de charts) |
| `vue/lib/` | Lógica sin interfaz: tema, notificaciones, formatos es-AR, íconos, fechas, montos, foco, flotantes, MFA |
| `vue/index.js` | API pública. Lo que no se exporta acá no existe para las apps |
| Dominio ticket (`EstadoTag`, `MedidorFlujo`, `AccionesFlujo`, `lib/flujo.js`…) | Vienen de la Ticketera. Se mantienen, pero no se documentan ni se generalizan sin una decisión |
| `sitio/` | Documentación viva (Vite + Vue Router). `src/demos/<id>/NN-nombre.vue` son demos reales; su código se muestra tal cual (`?raw`) |
| `sitio/src/datos/componentes.js` | Catálogo: título, grupo, descripción, textos de demos y **API documentada de cada componente** |
| `sitio/src/datos/navegacion.js` | Menú lateral y orden anterior/siguiente |
| `sitio/src/datos/ejemplo.js` | Datos de ejemplo compartidos por demos y vitrina |
| `docs/` | Guía de diseño y tokens (ver §10: hoy están desactualizados) |

## 4. Estatutos de identidad: «marcado técnico»

La interfaz se ve como el panel de un taller o un hangar: **cada registro es una pieza etiquetada**. Es una base oscura, sobria y densa para trabajar todo el día, y el carácter lo ponen las *calcas*: códigos estampados, series numeradas y marcas de advertencia. No es decoración: es vocabulario de herramientas de operación y cumplimiento.

No se negocian sin un ADR:

1. **Oscuro primero.** El tema oscuro es el principal; el claro existe y se mantiene a la par. Todo se prueba en los dos.
2. **La señal es de la interfaz, nunca de los datos.** `--senal` (violeta, marca Cardón) marca solo la acción principal, el elemento activo y el foco. Un valor, un estado o una serie de gráfico nunca usan la señal.
3. **Una sola acción principal (`.primario`) por vista.**
4. **Calma por defecto.** Lo normal es gris (`--txt`, `--sub`, `--tenue`). El color aparece solo para estado, vencimiento, error o dato.
5. **Lo que vence se marca con la cinta de precaución.** Lo vencido o por vencer que pide acción lleva `Advertencia` (franjas en los extremos y texto con qué pasa y cuándo). No se usa para estados comunes, que van con `.tag`.
6. **El color nunca es el único aviso.** Toda señal lleva texto, forma o ícono (los avisos tienen forma por tono; los topes escriben su estado).
7. **Lo identificable se estampa.** Códigos (`TK-1042`), series (`SERIE 01`), etiquetas de sección, cabeceras de tabla y la cinta de `Advertencia` van en `--mono`, en mayúsculas y con tracking (`.06em`–`.12em`), con peso de 600 a 800. Los estados comunes (`.tag`, `EstadoTag`, contadores) no se estampan: van en `--ui`, peso 600, con el tinte del tono y sin borde, para que lo estampado siga siendo la excepción.
8. **Densidad de herramienta.** Texto de 13 a 14 px, filas de 40 a 44 px y cifras con `tabular-nums` alineadas a la derecha.
9. **Líneas, no sombras.** Bordes de 1 px (`--borde`). Las sombras (`--sombra-*`) solo van en lo que flota: menús, diálogos, notificaciones. Para destacar un panel se usa el **marco de corte** (`.marco-corte`): líneas finas que pasan de largo en las esquinas, como en una plancha de calcas. No se usan sombras ni bordes de color. Se reserva para piezas protagonistas (paneles de indicadores, fichas clave) y no se pone en cada tarjeta. La única luz permitida es el halo de la señal en un control encendido (la perilla del `Interruptor`).
10. **Esquinas rectas y encuadre.** `--r-sm`, `--r-md` y `--r-lg` valen 0: todo es rectangular, como una pieza troquelada. El carácter lo dan las **esquinas de encuadre** (`.encuadre`, en «L», con `--encuadre-color`) en la acción principal, el ítem activo, avisos, indicadores y notificaciones, como el visor de una cámara. Nada de píldoras ni de glassmorphism. Los radios siguen siendo tokens: si una herramienta los necesita, se cambian ahí.
11. **Movimiento mínimo.** Alrededor de 120 ms, solo opacidad, color y desplazamientos cortos, siempre respetando `prefers-reduced-motion`. Solo dos cosas se mueven sin que nadie las toque: la cinta de `Advertencia animada` (para lo que pide acción ya) y la barra de tiempo de una notificación. Ninguna otra animación en loop.
12. **Marca Cardón.** El logo es el cardón sobre un cuadro verde con esquinas marcadas, «PALO» y el `producto` de cada herramienta. El verde y la flor (`--logo-*`) son solo de marca: no se usan en la interfaz.
13. **Sin dependencias visuales externas.** Las fuentes están alojadas en `fonts/` (no CDN): **Geist** para la interfaz (`--ui`), **Geist Mono** para códigos, series, etiquetas y cifras a comparar (`--mono`) y **Archivo** ancho solo para las calcas (`--display`, clase `.calca`: logo y títulos estampados, nunca texto corrido ni datos), y no se usan librerías de componentes, de íconos ni de gráficos.

## 5. Estatutos técnicos

- **Solo tokens.** En un componente no se escriben a mano `#hex`, `rgb()`, sombras ni `z-index`: se usa un token (`--capa-panel`, `--capa-modal`, `--capa-aviso`, `--capa-flotante`). `color-mix()` sobre tokens está permitido para tintes. Si falta un token, se agrega primero en `tokens.css`, para los dos temas.
- **Tinte de estado:** fondo con el color al 16 %, borde (si lleva) al 40–45 % y texto al 75–80 % mezclado con `--txt`. Nunca se usan bloques sólidos de color de estado; la única excepción es la placa de `alertar()`.
- **Producto-neutral.** La librería no conoce a ninguna app: nada de «PaloPay», cuentas, cobros ni tickets en textos por defecto, props o nombres de íconos. Lo propio de cada producto entra por props (`producto`, `serie`, `emisor`, `unidad`…).
- **Vue 3 `<script setup>`, JavaScript sin TypeScript, sin dependencias en runtime** (Vue es una peerDependency). Las props se documentan en el comentario de cabecera del componente.
- **Nombres en español,** como la mayoría de la librería (`BarraLateral`, `Desplegable`, `Indicador`). Los componentes nuevos se nombran en español (ver §10 para los que hoy están en inglés).
- **Clases internas y de tono con prefijo** (`tono-error`, `alerta-titulo`, `toast-txt`): el `scoped` de Vue no protege de las clases globales de una app ni de las utilidades de la hoja base (`.error`, `.aviso`, `.cuerpo`). Nunca un tono como clase suelta.
- **Comentarios breves en español,** que expliquen el porqué y no repitan el código. Mantener la densidad de comentarios del archivo que se toca.
- **Accesibilidad mínima:** foco visible (anillo `--senal`), todo operable con teclado, `aria-label` en los botones de solo ícono, Escape cierra lo que flota y el foco queda atrapado en los diálogos (`useFocusTrap`). Los errores se anuncian (`role="alert"`) y se respeta el contraste AA en los dos temas.
- **Formatos es-AR** desde `vue/lib/graficos.js`, `fechas.js` y `montos.js`. No se formatea a mano en los componentes.

### Gráficos

- Las series van en orden fijo, `--serie-1…4`, nunca con un color de estado ni con la señal. El color sigue a la entidad: si se filtra una serie, las demás no cambian de color. Más de 4 partes se agrupan en «Otros». El resto de un total (otros, sin dato, capacidad libre) va en **trama** (`--trama`, rayas verticales grises, prop `resto`) y no en un color de serie, siempre con su nombre escrito.
- Un solo eje vertical. Las barras empiezan en cero.
- `descripcion` es obligatoria y cada gráfico ofrece «Ver tabla» con los mismos datos.
- Textos, ejes y leyendas van en colores de texto: el color de la serie está en la marca, no en las letras.

## 6. Voz y textos

- Español rioplatense con **voseo** («Probá», «Tocá», «Revisalas»). Frases cortas y concretas.
- Los botones son verbos con objeto («Enviar a firmar», «Guardar cambios»), no «Aceptar» ni «OK».
- Los errores dicen qué pasó y qué hacer («Superan los 20 MB. Comprimilos y probá de nuevo.»).
- Las confirmaciones hacen una pregunta concreta y nombran la consecuencia. Las notificaciones van en pasado («Enviado a firmar»).
- Los datos de ejemplo son mixtos entre productos (solicitudes, documentos, altas, cobros) y siempre se marcan como ejemplo.

## 7. Cómo se cambia algo (flujo SDD)

Primero se define y después se implementa. Según el tamaño:

1. **Especificar.** Para un componente nuevo o un cambio de API: qué problema resuelve, en qué productos se usa, props, eventos y slots, estados (vacío, carga, error, deshabilitado), teclado y lectores de pantalla, y qué *no* hace. Se acuerda antes de escribir código.
2. **Decidir.** Si se toca un estatuto de §4 o §5, un token de marca o la API pública de forma incompatible, se escribe un ADR.
3. **Implementar** en `vue/` respetando §4 y §5, y exportar en `vue/index.js`.
4. **Documentar en el sitio,** en el mismo cambio: una demo en `sitio/src/demos/<id>/`, la entrada en `componentes.js` (descripción, demos y API real) y en `navegacion.js` si es nuevo.
5. **Verificar:** `npm run build` en `sitio/` y la lista de §8.

Un cambio incompatible (renombrar una prop, cambiar un default, renombrar un ícono) se avisa en el resumen del cambio con lo que deben ajustar las apps.

## 8. Lista de terminado

- [ ] Solo tokens; nada de colores, sombras ni capas a mano.
- [ ] La señal solo en acción principal, activo o foco. Una sola acción principal por vista.
- [ ] Cada color de estado acompañado de texto o forma.
- [ ] Probado en oscuro y en claro, con teclado y con `prefers-reduced-motion`.
- [ ] Cifras tabulares; códigos y series en mono y en mayúsculas.
- [ ] Sin nombres ni textos de un producto en particular.
- [ ] Demo y API actualizadas en el sitio; `npm run build` sin errores.

## 9. Fuera de alcance

Lógica de negocio, llamadas a servidores, estado global de las apps y validaciones de dominio. La librería emite eventos y muestra lo que recibe. Por ejemplo, el MFA no genera claves ni valida códigos.

## 10. Deuda conocida

- `docs/sistema-visual.md` y `docs/tokens.md` describen la Ticketera (señal **amarilla**, rutas `web/src/...`). Desde la 1.0.0 no se publican con el paquete; hay que reescribirlos para este repo. Mientras tanto, la referencia es este archivo y el sitio.
- `DataTable`, `Descriptions`, `Field`, `CurrencyInput`, `DatePicker`, `Modal`, `Drawer`, `Tooltip`, `Popover`, `Overlay`, `Skeleton` y `Spin` están en inglés, contra la regla de §5. Falta decidir (con un ADR) si se renombran con alias o si se acepta la excepción.
- No hay pruebas automáticas ni verificación de contraste.
