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
      <div class="logos"><Marca producto="Pay" grande /><Marca producto="Docs" /><Marca producto="Onboarding" /><Marca producto="Tickets" serie="Soporte" /><Marca solo-icono /></div>
      <p class="sub">Siempre con el componente <code>Marca</code>. «PALO» y el cardón son iguales en todas las herramientas; cada una pasa su <code>producto</code> (PAY, DOCS, ONBOARDING, TICKETS…) y, si quiere, una <code>serie</code> debajo.</p>
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
  </article>
</template>

<style scoped>
.logos { --marco: var(--panel); display: flex; flex-wrap: wrap; align-items: center; gap: 28px; padding: 24px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
</style>
