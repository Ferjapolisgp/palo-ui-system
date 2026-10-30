# Cambios

Formato: lo que cambia para las apps que usan la librería. **Rompe** marca lo que obliga a ajustar código o revisar pantallas.

## 1.1.0 · 2026-10-30

- `Kanban`: tablero de columnas con tarjetas que se arrastran. Reglas por `puedeSoltar` (con motivo escrito), límite por columna, orden dentro de la columna, solo lectura y movimiento completo con teclado. Arrastre nativo, sin dependencias: en pantallas táctiles se mueve con teclado.

## 1.0.0 · 2026-10-30

Primera versión estable de Palo UI: el sistema visual de la Ticketera pasa a ser una librería común para Ticketera, Palo Docs, Palo Onboarding y PaloPay.

### Identidad

- **Rompe** Marca Cardón: la señal pasa del amarillo de la Ticketera al violeta (`--senal`), y el logo es el cardón sobre un cuadro verde (`--logo-*`).
- **Rompe** Fuentes: Geist (`--ui`) y Geist Mono (`--mono`) reemplazan a Inter y JetBrains Mono. Se suma Archivo con eje de ancho (`--display`, clase `.calca`) solo para el logo y los títulos estampados. Los archivos viejos ya no están en `fonts/`.
- **Rompe** Esquinas rectas: `--r-sm`, `--r-md` y `--r-lg` valen 0. El carácter lo dan las esquinas de encuadre (`.encuadre`) en la acción principal, el ítem activo, avisos, indicadores y notificaciones.
- **Rompe** Botones secundarios con tinte; el principal con tinte de la señal y esquinas de encuadre en vez de fondo sólido.
- **Rompe** `.tag`, `EstadoTag` y los contadores van en `--ui`, con fondo tintado, sin borde ni mayúsculas.
- Avatar cuadrado: una sola inicial hasta 24 px, ícono de usuario cuando no hay persona.

### Librería sin producto

- **Rompe** `Marca` y `BarraLateral`: nueva prop `producto` («Pay», «Docs», «Tickets»…). Sin ella el logo dice solo «PALO» (antes decía «PALOPAY»). `serie` pasa a vacía por defecto (antes «SERIE 01 · OPERACIONES» y «OPERACIONES»).
- **Rompe** Íconos renombrados: `pagos` → `tarjeta`, `conciliar` → `revisado`, `beneficios` → `estrella`.
- **Rompe** `uriTotp()`: el emisor por defecto pasa de «PaloPay» a «Palo». Conviene pasar el de cada herramienta (`emisor: 'Palo Docs'`).
- Íconos nuevos: bandeja, ticket, documento, carpeta, calendario, reloj, alerta, campana, mas, editar, borrar, descargar, subir, filtro, enlace, usuario, sobre, marcador, info, error y peligro.

### Componentes y piezas nuevas

- `Advertencia`: cinta de precaución para lo vencido o por vencer (`tono` error o aviso). Error con rayas en espejo, aviso con cheurones hacia el texto; `animada` las hace entrar desde los bordes. `BandaAdvertencia` (dominio ticket) la usa por dentro.
- `.marco-corte` (y `.esquinas`): líneas que pasan de largo en las esquinas, para destacar un panel. Tokens `--corte-*`.
- Trama (`--trama`, `.trama`): rayas grises para el resto de un total. `GraficoComposicion` suma la prop `resto`; el `Indicador` acepta partes con `resto: true` y el tope dibuja lo libre en trama.
- `Indicador`: prop `forma` (`linea`, `barras`, `composicion`, `tope`) y `grafico` (`degrade`, `solido`). La línea es una curva suave a sangre; al pasar el puntero, el número y la variación muestran el punto. **Rompe** ya no hay tooltip flotante.
- Notificaciones: `tono` (ok, info, aviso, error), `variante` (`compacta`), `accion`, `icono`, `canal`, barra de tiempo que se pausa al leer, y `alertar()` para la placa de precaución (la de error no tiene cruz: obliga a actuar). `<Notificaciones>` suma `posicion`, `maximo` y `canal`. Los errores ya no se cierran solos.
- `Interruptor`: riel rectangular; encendido, la perilla se ilumina con la señal.
- Tarjetas: variantes, `ProfileCard` y `ActionCard`.

### Correcciones

- Las clases de tono de los componentes pasan a `tono-error`, `tono-aviso`, `tono-ok` y `tono-info`. Antes chocaban con utilidades globales: el `Aviso` de info se veía naranja, y con tono error el texto salía en rojo con margen extra (Aviso, Indicador, contadores de la barra lateral y de `ActionCard`, Gráfico de tope, `MedidorFlujo`, `CodigoVerificacion`).
- **Rompe** `.error` de la hoja base solo da color; el margen de 8 px queda para `p.error` (mensaje de formulario). Si una app usaba `div.error` para mensajes, revisar el espaciado.
- Las notificaciones que quedan en «+N más» no gastan su tiempo hasta que se ven.

### Paquete

- `docs/` deja de publicarse: describe todavía la Ticketera. La referencia es el sitio (`sitio/`) y `CLAUDE.md`.
