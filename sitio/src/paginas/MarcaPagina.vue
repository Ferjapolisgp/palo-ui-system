<script setup>
import { Marca } from 'palo-ui-system';
import { usarTokens } from '../usarModo.js';

const t = usarTokens(['logo-fondo', 'logo-figura', 'logo-flor', 'senal', 'senal-txt']);
</script>

<template>
  <article class="doc">
    <p class="miga">Fundamentos</p>
    <h1>Marca</h1>
    <p class="lead">El logo es un cardón: crece donde casi nada crece y guarda reserva para la sequía, como un monotributista que se sostiene solo. «Palo» viene de Paloma, que propuso el desarrollo, y también nombra el tronco del cactus.</p>

    <section>
      <h2 id="logo">Logo</h2>
      <div class="logos"><Marca producto="Pay" tam="lg" /><Marca producto="Docs" /><Marca producto="Onboarding" /><Marca producto="Tickets" serie="Soporte" /><Marca solo-icono /></div>
      <p class="sub">Siempre con el componente <code>Marca</code>. «PALO» y el cardón son iguales en todas las herramientas; cada una pasa su <code>producto</code> (PAY, DOCS, ONBOARDING, TICKETS…) y, si quiere, una <code>serie</code> debajo.</p>
    </section>

    <section>
      <h2 id="variantes">Variantes</h2>
      <p class="etq">Tamaños · <code>tam</code></p>
      <div class="logos"><Marca producto="Pay" tam="sm" /><Marca producto="Pay" tam="md" /><Marca producto="Pay" tam="lg" /></div>
      <p class="etq">Orientación · <code>orientacion</code></p>
      <div class="logos"><Marca producto="Docs" serie="Serie 02" /><Marca producto="Docs" serie="Serie 02" orientacion="vertical" tam="lg" /></div>
      <p class="etq">Partes · <code>solo-icono</code>, <code>solo-texto</code></p>
      <div class="logos"><Marca producto="Pay" solo-icono /><Marca producto="Pay" solo-texto /></div>
      <p class="etq">Color de «PALO» · <code>verde</code></p>
      <div class="logos"><Marca producto="Pay" tam="lg" /><Marca producto="Pay" tam="lg" verde /></div>
      <p class="etq">Una sola tinta · <code>tono="mono"</code></p>
      <div class="fondos">
        <div class="fondo oscuro"><Marca producto="Pay" tono="mono" /></div>
        <div class="fondo claro"><Marca producto="Pay" tono="mono" /></div>
      </div>
      <p class="sub">El tono mono es para impresión, sellos y fondos de color: el cuadro toma el color de texto y la figura se recorta con el fondo.</p>
    </section>

    <section>
      <h2 id="respeto">Zona de respeto y tamaño mínimo</h2>
      <div class="logos">
        <div class="zona"><Marca producto="Pay" tam="lg" /></div>
        <p class="sub">Dejá libre alrededor del logo al menos el alto del cardón. Tamaño mínimo: <b>16 px</b> de cardón con texto y <b>20 px</b> solo el ícono. Por debajo se pierde el cardón.</p>
      </div>
    </section>

    <section>
      <h2 id="incorrectos">Usos incorrectos</h2>
      <div class="malos">
        <figure><div class="mal estirado"><Marca producto="Pay" /></div><figcaption>No lo estires ni lo deformes.</figcaption></figure>
        <figure><div class="mal sombra"><Marca producto="Pay" /></div><figcaption>Sin sombras ni contornos.</figcaption></figure>
        <figure><div class="mal girado"><Marca producto="Pay" /></div><figcaption>No lo gires.</figcaption></figure>
        <figure><div class="mal otro-color"><Marca producto="Pay" /></div><figcaption>No cambies el verde: es el de marca.</figcaption></figure>
        <figure><div class="mal"><button type="button" class="primario">Guardar cambios</button><span class="verde-ui">Al día</span></div><figcaption>El verde y la flor no se usan en la interfaz.</figcaption></figure>
      </div>
    </section>

    <section>
      <h2 id="colores">Dos colores, dos papeles</h2>
      <div class="swatches">
        <div class="sw"><i style="background: var(--logo-fondo)"></i><span><b>--logo-fondo</b><br>{{ t['logo-fondo'] }}<br>solo el logo</span></div>
        <div class="sw"><i style="background: var(--logo-flor)"></i><span><b>--logo-flor</b><br>{{ t['logo-flor'] }}<br>la flor del cardón</span></div>
        <div class="sw"><i style="background: var(--senal)"></i><span><b>--senal</b><br>{{ t.senal }}<br>acción, activo, foco</span></div>
      </div>
      <p>El verde es la identidad y vive solo en el logo. El violeta es la señal: marca lo que se puede tocar. Así el verde de los estados («al día», «acreditado») nunca se confunde con un botón.</p>
    </section>

    <section>
      <h2 id="icono-app">Ícono de app</h2>
      <div class="logos"><Marca solo-icono tam="sm" /><Marca solo-icono /><Marca solo-icono tam="lg" /></div>
      <p class="sub">Para favicon y pantalla de inicio se usa solo el cardón sobre el cuadro verde, en 16, 32 y 192 px; las esquinas marcadas se omiten por debajo de 32 px.</p>
    </section>

    <section>
      <h2 id="calcas">Tipografía de calcas</h2>
      <div class="logos"><span class="calca grande-calca">Palo UI</span><span class="sub">Archivo ancho, en mayúsculas y peso 800 (<code>.calca</code>).</span></div>
      <p>Es solo para el logo y los títulos estampados (portadas, ingreso, vacíos grandes). Nunca texto corrido ni datos: ahí van Geist y Geist Mono.</p>
    </section>

    <section>
      <h2 id="encuadre">Esquinas de encuadre</h2>
      <div class="logos"><div class="muestra encuadre">Pieza con encuadre</div><div class="muestra encuadre" style="--encuadre-color: var(--ok); --esq: 22px; --esp: 2px;">Con tono</div></div>
      <p>El motivo gráfico de la marca: cuatro esquinas en «L» pegadas al borde (<code>.encuadre</code>). Se usa en tarjetas, avisos, paneles y diálogos, y no se mezcla con el marco de corte (<code>.marco-corte</code>) en la misma pieza.</p>
    </section>
  </article>
</template>

<style scoped>
.logos { --marco: var(--panel); display: flex; flex-wrap: wrap; align-items: center; gap: 28px; padding: 24px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
.etq { margin: 18px 0 6px; font: 600 .66rem var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--sub); }
.fondos { display: flex; flex-wrap: wrap; gap: 12px; }
.fondo { flex: 1 1 200px; display: grid; place-items: center; padding: 28px; border: 1px solid var(--borde); }
.fondo.oscuro { --bg: #14161a; --txt: #e6e8ec; --marco: #14161a; background: #14161a; }
.fondo.claro { --bg: #eef0f3; --txt: #171a1f; --marco: #eef0f3; background: #eef0f3; }
.zona { padding: 48px; outline: 1px dashed var(--borde-fuerte); outline-offset: -1px; }
.malos { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.malos figure { margin: 0; }
.mal { --marco: var(--panel); position: relative; display: flex; align-items: center; justify-content: center; gap: 12px; height: 110px; background: var(--panel); border: 1px solid var(--borde); overflow: hidden; }
.mal::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top right, transparent calc(50% - 1px), var(--error) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)); opacity: .7; pointer-events: none; }
.estirado :deep(.marca) { transform: scaleX(1.5); }
.sombra :deep(.ico) { box-shadow: 0 6px 14px rgba(0, 0, 0, .6); outline: 2px solid var(--error); }
.girado :deep(.marca) { transform: rotate(-12deg); }
.otro-color { --logo-fondo: var(--senal); }
.verde-ui { padding: 2px 8px; background: var(--logo-fondo); color: var(--logo-figura); font-weight: 600; font-size: .75rem; }
figcaption { margin-top: 6px; font-size: .8rem; color: var(--sub); }
.grande-calca { font-size: 2rem; }
.muestra { position: relative; padding: 22px 28px; background: var(--panel); border: 1px solid var(--borde); font-size: .86rem; }
</style>
