# Sistema visual de la Ticketera

> Estado: **aceptado** ([ADR-010](../decisiones/ADR-010-identidad-y-sistema-visual.md)). Este documento es la referencia obligatoria para cualquier cambio de interfaz o función nueva.

## 1. Qué tomamos de cada referencia

| Referencia | Qué aporta | Dónde se aplica |
|---|---|---|
| **1 y 2 · Flota AGV** (oscuro, industrial) | Tema oscuro sobrio; cabeceras de columna apagadas; estado con mini-insignia de letra; píldora roja tenue para el retraso (`+30 sek`); medidor segmentado (batería); fila «fuera de servicio» atenuada con `---`; en hover la celda del identificador se resalta y muestra `↗`; buscador con lupa + botón de acción al lado; scrollbar fina | Lista, tarjeta, SLA, buscador |
| **3 · CRM de ventas** | Barra lateral con secciones y contadores; pestañas bajo el título; barra de filtros en chips desplegables (*Ordenar · Filtro · Estado*); selección con casillas; etiquetas tintadas (+N); avatares; barra segmentada y mini-gráficos en la celda; fila de totales al pie («20 en vista · suma · promedio») | Navegación, Filtros, Lista, pie de lista |
| **4 · Mutual TLS** (maestro-detalle) | Lista de tarjetas a la izquierda, detalle a la derecha sin perder el contexto; detalle en bloques clave/valor separados por líneas finas; acciones de texto («Vista previa» azul, «Eliminar» rojo); interruptor; insignia de contador | TicketDrawer → panel de detalle |
| **5 · Plancha de calcas** (identidad) | **Es la identidad.** Marcado técnico industrial: amarillo señal + gris grafito sobre fondo gris azulado; series numeradas (`01 02 03`), códigos tipo `E1…E4`, triángulos de precaución, `WARNING`, microtexto, cajas con etiqueta, tipografía ancha y pesada en mayúsculas | Logo, códigos de ticket, prioridad, vacíos, detalles gráficos |

### Concepto: «Marcado técnico»
La Ticketera se ve como el panel de un taller o hangar: **cada pedido es una pieza etiquetada**. Interfaz oscura y sobria para el trabajo diario (referencias 1–4); el carácter lo ponen las *calcas* (referencia 5): el código del ticket como etiqueta estampada, el amarillo señal como único color de marca y las marcas de advertencia para lo que vence o es urgente.

Encaja con el producto: es una herramienta de seguridad y cumplimiento (ISO 27001), donde «advertencia», «precaución» y «serie numerada» son vocabulario propio y no decoración.

## 2. Principios (para decidir lo que este documento no prevea)

1. **El amarillo es de la interfaz, nunca de los datos.** Solo marca acción principal, elemento activo y foco. Así no se confunde con los estados.
2. **Calma por defecto, señal solo cuando hay algo que decir.** Todo lo normal es gris; el color aparece para tipo, estado, vencimiento y error.
3. **El color nunca es el único aviso.** Cada señal lleva además texto, ícono o forma (accesibilidad y fotocopias en blanco y negro de auditoría).
4. **Densidad de herramienta de trabajo.** Filas de 40 px, texto de 13–14 px, números tabulares. Se ve mucho sin gritar.
5. **Lo identificable se estampa.** Códigos, series y etiquetas van en monoespaciada, mayúsculas, con caja: como una calca.
6. **Un solo lugar para cada cosa.** Ningún color, tamaño o sombra se escribe a mano en un componente: se usa un token.

## 3. Tokens

Se definen en `web/src/styles/global.css` (hoy tiene 10 variables; pasa a ser el único origen). Oscuro es el tema principal; el claro se conserva (sigue `prefers-color-scheme`, con opción manual más adelante).

### 3.1 Color base

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#14161a` | `#eef0f3` | Fondo de la página |
| `--panel` | `#1b1e24` | `#ffffff` | Barra lateral, tarjetas, cabeceras |
| `--panel-2` | `#22262d` | `#f6f7f9` | Campos, columnas, hover de fila |
| `--borde` | `#2c313a` | `#d9dde3` | Líneas finas |
| `--borde-fuerte` | `#3a404b` | `#b9bfc9` | Campos, foco secundario |
| `--txt` | `#e6e8ec` | `#171a1f` | Texto principal |
| `--sub` | `#9097a3` | `#5d6470` | Texto secundario, cabeceras de columna |
| `--tenue` | `#5f6672` | `#8b919c` | Deshabilitado, `---` |

Los fondos llevan un matiz azulado (como el fondo de la plancha), no gris neutro.

### 3.2 Marca

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--senal` | `#ffd400` | `#f2c200` | Acción principal, pestaña activa, foco, marca |
| `--senal-txt` | `#14161a` | `#14161a` | Texto sobre amarillo (siempre grafito) |
| `--grafito` | `#4a4f57` | `#4a4f57` | Segundo tono de las calcas: etiquetas, ilustraciones |

En claro, el botón principal puede ser grafito con borde amarillo si el amarillo no da contraste suficiente como fondo de texto pequeño; el texto sobre amarillo se mantiene grafito en ambos temas.

### 3.3 Semánticos (siempre con tinte, nunca bloques sólidos)

| Token | Valor | Uso |
|---|---|---|
| `--ok` | `#3fb27f` | Resuelto, verificado, SLA en plazo |
| `--aviso` | `#f08c2e` | Por vencer, pendiente de aprobación (naranja, **no** amarillo) |
| `--error` | `#ef5b5b` | Vencido, rechazado, error, acciones destructivas |
| `--info` | `#4c8dff` | Nuevo, enlaces, acciones secundarias de texto |

Fórmula del tinte (la píldora roja de la referencia 1): `fondo = color 16 %`, `borde = color 40 %`, `texto = color 80 % + --txt`. Ya existe esa fórmula en `CodigoTicket.vue`; pasa a ser la clase común `.tinte`.

### 3.4 Color por tipo y estado
Los nueve colores de tipo ([ADR-009](../decisiones/ADR-009-codigo-de-ticket-por-tipo.md)) y los de estado (`web/src/lib/estados.js`) **se mantienen** como datos. Revisión pendiente: *Cambio* (ámbar) y *No conformidad* (ocre) están cerca del amarillo de marca; se desplazan a naranja `#e8863a` y bronce `#b98a2e` para que el amarillo siga siendo exclusivo de la interfaz.

### 3.5 Tipografía

| Rol | Fuente | Detalle |
|---|---|---|
| Interfaz | **Inter** | 13/14 px en tablas, 15 px en lectura; `font-variant-numeric: tabular-nums` en cifras |
| Códigos, series, etiquetas, microtexto | **JetBrains Mono** | Mayúsculas, `letter-spacing: .06em`, peso 600–700 |
| Títulos de pantalla y logo | Inter 700–800 | Mayúsculas con tracking ancho solo en el logo y en cabeceras de sección de la barra lateral |

Las fuentes se **alojan localmente** (no CDN): hay cabeceras de seguridad y CSP del paso J y el producto debe funcionar en la red interna. Confirmar la CSP al incorporarlas.

### 3.6 Espacio, forma y profundidad

- Escala de espacio: 4 · 8 · 12 · 16 · 24 · 32.
- Radios: `--r-sm 4px` (etiquetas, calcas), `--r-md 8px` (campos, botones, tarjetas), `--r-lg 12px` (paneles, ventanas).
- Líneas de 1 px en vez de sombras; sombra solo en elementos flotantes (menús, modales).
- Foco visible: anillo de 2 px en `--senal` en todo lo interactivo.
- Movimiento: 120 ms, solo opacidad, color y desplazamiento corto; respetar `prefers-reduced-motion`.
- Scrollbar fina de 8 px, `--borde-fuerte` (referencia 1).

## 4. Piezas

Cada pieza es un componente o clase única; no se reimplementa en pantallas.

| Pieza | Descripción | Origen |
|---|---|---|
| **Calca de código** (`CodigoTicket`) | `INC-0007` en monoespaciada, caja de radio 4 con tinte del tipo; los confidenciales llevan candado como marca. En hover (lista) se resalta la celda y aparece `↗` | Ref. 2 y 5 |
| **Píldora tintada** | Estado, prioridad, retraso (`+2 d`), etiquetas; con `+N` cuando no caben | Ref. 1 y 3 |
| **Insignia de modo** | Cuadrito con una letra (A/M en la referencia): aquí marca origen del ticket o rol, si hace falta | Ref. 1 |
| **Marca de advertencia** | Triángulo ▲ + texto para *urgente* y *vencido*; chevrón `»` para *por vencer*. Reemplaza el borde de color de la tarjeta como único aviso | Ref. 5 |
| **Medidor SLA** | Barra segmentada de 5 tramos que se vacía hasta el vencimiento; verde → naranja → rojo, con el tiempo en texto al lado | Ref. 1 y 3 |
| **Avatar** | Iniciales en círculo; sin asignar = círculo punteado | Ref. 3 |
| **Barra de herramientas** | Buscador con lupa + chips desplegables (*Tipo · Prioridad · Asignado · Estado*) + botón principal amarillo «+ Nuevo pedido» alineado a la derecha | Ref. 1 y 3 |
| **Tabla** | Cabeceras en `--sub` y mayúscula pequeña; fila de 40 px; hover `--panel-2`; casilla de selección; fila seleccionada con barra amarilla de 2 px a la izquierda; terminados atenuados | Ref. 2 y 3 |
| **Pie de totales** | «23 pedidos en vista · 4 vencidos · 6 sin asignar» (sustituye al aviso de SLA suelto de hoy) | Ref. 3 |
| **Barra lateral** | Logo, secciones (*Trabajo*: Kanban, Lista · *Control*: Auditoría, Usuarios · *Mi cuenta*), contadores (vencidos, esperando aprobación), «+ Nuevo pedido» fijo abajo | Ref. 3 y 4 |
| **Maestro-detalle** | En Lista, abrir un pedido muestra el detalle a la derecha (no como cajón superpuesto); bloques «Datos / Historial / Aprobaciones» con título apagado, pares clave–valor y línea fina entre bloques; acciones como texto (azul / rojo) | Ref. 4 |
| **Vacío** | Mensaje corto con una calca grande y apagada, sin ilustraciones decorativas | Ref. 5 |
| **Marca** | Logo = «TICKETERA» en caja con esquinas marcadas + la serie `01` como detalle; fondo amarillo solo en el ícono | Ref. 5 |

## 5. Plan de adopción (sin romper nada)

Cada paso es independiente, se puede probar y revertir.

| Paso | Qué | Riesgo |
|---|---|---|
| **V0** | Tokens nuevos en `global.css`, fuentes locales, base de campos/botones/foco. Los componentes siguen funcionando con alias de las variables viejas (`--acento` → `--senal`) | Bajo: cambia el aspecto global, no la estructura |
| **V1** | Barra lateral (reemplaza `Nav.vue`) con contadores | Medio: cambia el marco de todas las páginas |
| **V2** | Lista: tabla densa, chips de filtro, selección, pie de totales, calca con `↗` | Medio |
| **V3** | Kanban y `TicketCard`: marca de advertencia, medidor SLA, avatar punteado | Bajo |
| **V4** | Maestro-detalle en la Lista (el cajón se mantiene en Kanban) | Medio |
| **V5** | Pantallas de Auditoría, Usuarios, Seguridad, Login con el mismo sistema; logo y vacíos | Bajo |
| **V6** | Vista previa de todas las piezas (`/estilos`, solo desarrollo) y regla de revisión | Bajo |

## 6. Reglas para cambios futuros

Al añadir o cambiar una pantalla, comprobar:

- [ ] Usa solo tokens de este documento; ningún `#hex` ni `px` de color/espacio suelto en un componente.
- [ ] El amarillo aparece solo en acción principal, activo o foco.
- [ ] Toda señal de color lleva también texto o forma.
- [ ] Cifras con `tabular-nums`; códigos y series en monoespaciada.
- [ ] Una sola acción principal (amarilla) por vista.
- [ ] Probado en tema claro y oscuro, y con foco por teclado.
- [ ] Si se necesita algo que no existe (token o pieza), se **añade aquí primero** y luego se usa.

## 7. Lo que no cambia

El modelo de datos, las reglas de estado, la visibilidad por rol y la seguridad (confidencial, MFA, auditoría). Esto es solo capa visual y de navegación.

## 8. Decisiones cerradas en la maqueta (prevalecen sobre lo anterior)

| Pieza | Decisión |
|---|---|
| Código | `PREFIJO-NNNN` en monoespaciada extra bold, **sin caja y de un solo color**. El tipo se reconoce por el prefijo. Los confidenciales llevan `LOCK` (texto pequeño, gris) a la derecha, sin candado. Sustituye al color por tipo de [ADR-009](../decisiones/ADR-009-codigo-de-ticket-por-tipo.md) en la interfaz. |
| Estado | Rectángulo de **ancho fijo (96 px)**, borde de color, fondo transparente, una palabra en mayúsculas: Nuevo · Aprobación · Aceptado · Procesando · Espera · Resuelto · Verificado · Cerrado · Rechazado. El nombre completo va en el tooltip. |
| Banda de advertencia | Solo para urgentes: **roja** si ya vencieron, **naranja** si vencen en 24 h. Reemplaza al medidor en esa celda. |
| Medidor de flujo | Los tramos son los **pasos del flujo del ticket**; el color es el plazo (verde, naranja, rojo). Ancho fijo de 38 px: con más pasos (p. ej. dos aprobadores) los tramos se afinan y, pasados 8, se agrupan. |
| Filtros | Desplegable propio: el botón muestra solo el valor corto; el menú lista las opciones completas con ✓ en la elegida. |
| Sin flecha ↗ junto al código. | |
| Cambio de estado | No hay selector de estado: el detalle ofrece **botones del paso siguiente** (`AccionesFlujo`), calculados con `lib/flujo.js`, que replica la máquina de estados del servidor (`server/estados.py`) y sus reglas (resolver exige los datos de resolución y la aprobación; no se verifica lo que uno resolvió; una solicitud la cierra quien la pidió o un administrador). Solo existen los pasos que el flujo permite; los que esa persona no puede dar se ven deshabilitados con el motivo escrito. El paso normal va en amarillo y *Rechazar* en rojo. *Cerrar* pide confirmación. En el tablero, las columnas que no aceptan el ticket arrastrado se atenúan y se muestra a cuáles puede ir. |
| Prioridad y responsable | Se editan solo mientras el ticket está abierto. Desde Resuelto la prioridad se muestra fija con el motivo; el responsable se muestra como avatar y nombre con los botones **Tomar** y **Reasignar** (con motivo; en Resuelto, «Reasignar para verificar»). Ver [ADR-011](../decisiones/ADR-011-prioridad-y-responsable-fijos-al-resolver.md). |
| Detalle del ticket | Tres pestañas: **Datos**, **Conversación** (comentarios) e **Historial** (cada paso o interacción, del más reciente al más antiguo, con el cambio de estado como dos etiquetas). | Cuando el ticket está resuelto o rechazado, debajo de *Detalle* se muestra el mensaje de resolución o de rechazo con su autor y fecha. Cabecera, pasos y pestañas quedan fijos: solo el contenido de la pestaña se desplaza. Los campos que quedan fijos (prioridad y responsable) muestran la misma leyenda: «Un ticket cerrado ya no admite cambios.» Los campos se ven como texto; **Editar** (solo mientras el ticket no está en un estado final) muestra los controles y exige un **motivo**, que se guarda como mensaje del ticket junto con el cambio. El bloque «Paso siguiente» es el **pie fijo** del detalle, para recorrer los datos antes de actuar; al editar, el pie pasa a ser el motivo y Guardar. La lista ocupa el alto de la ventana: no se desplaza la página, sino la tabla y el contenido de la pestaña.
| Maestro-detalle | En la Lista, con pantalla de 1280 px o más, el detalle queda fijo a la derecha (420 px) y se ocultan las columnas Asignado y Actividad; en pantallas menores o en el Tablero se abre como cajón (`TicketDrawer`, prop `modo`). El detalle tiene dos pestañas: Datos y Conversación e historial. |

## 9. Dónde está en el código

| Qué | Archivo |
|---|---|
| Tokens y base | `web/src/styles/global.css` (con alias de los nombres anteriores hasta que cada pantalla migre) |
| Reglas (estado corto, pasos, plazo, banda) | `web/src/lib/visual.js` |
| Piezas | `web/src/components/ui/` (`EstadoTag`, `PrioridadMarca`, `BandaAdvertencia`, `MedidorFlujo`, `VenceTicket`, `Avatar`, `Desplegable`) y `web/src/components/CodigoTicket.vue` |
| Logo | `web/src/components/ui/Marca.vue` (barra lateral y Login) |
| Etiqueta de resultado (`.tag`), tabla de administración (`.tabla-simple`), títulos (`.titulo-pagina`) | clases globales en `web/src/styles/global.css` |
| Guía viva | página `/estilos` (`web/src/components/Estilos.vue`) |

Pendiente: alojar Inter y JetBrains Mono localmente (hoy hay fallback a las fuentes del sistema) y que el servidor informe la ruta de pasos de cada ticket (`ruta`, `paso`).

## 10. Paquete reutilizable (`design-system/`)

El sistema visual se exporta como un paquete local autocontenido para usarlo en otra herramienta: `node scripts/exportar_sistema_visual.mjs` regenera `design-system/` (CSS de tokens y base, fuentes, componentes Vue 3, esta guía y un catálogo `demo.html`). El origen de verdad sigue siendo `web/`: **no se edita `design-system/` a mano**; después de cambiar tokens, componentes de `web/src/components/ui` o este documento, se vuelve a exportar y se versiona el resultado. Uso e instalación: `design-system/README.md`.
