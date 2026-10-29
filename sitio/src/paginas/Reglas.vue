<script setup>
import Codigo from '../componentes/Codigo.vue';
</script>

<template>
  <article class="doc">
    <p class="miga">Fundamentos</p>
    <h1>Reglas de uso</h1>
    <p class="lead">Cuatro reglas que mantienen coherentes todas las herramientas internas. Si un caso no encaja, se discute y se agrega aquí.</p>

    <section class="regla">
      <h2 id="senal">1. La señal es de la interfaz, nunca de los datos</h2>
      <p class="sub">Acción principal, ítem activo y foco. Un dato o un estado nunca van en violeta.</p>
      <div class="sino">
        <div><span class="tag ok">Sí</span><button type="button" class="primario" tabindex="-1" style="justify-self: start">Guardar cambios</button></div>
        <div><span class="tag error">No</span><span style="font: 700 1.2rem var(--mono); color: var(--senal)">1.284 solicitudes</span></div>
      </div>
    </section>
    <section class="regla">
      <h2 id="color">2. El color nunca es el único aviso</h2>
      <p class="sub">Siempre con texto o forma, para quien no distingue colores o mira de reojo.</p>
      <div class="sino">
        <div><span class="tag ok">Sí</span><span class="tag error">Deuda</span></div>
        <div><span class="tag error">No</span><span role="img" aria-label="Punto rojo sin texto" style="width: 10px; height: 10px; border-radius: 50%; background: var(--error)"></span></div>
      </div>
    </section>
    <section class="regla">
      <h2 id="tokens">3. Todo valor visual sale de un token</h2>
      <p class="sub">Color, tamaño, radio y sombra. Nada escrito a mano dentro de un componente.</p>
      <Codigo suelto codigo=".boton { background: var(--senal); }   // sí
.boton { background: #7c4dff; }        // no" />
    </section>
    <section class="regla">
      <h2 id="codigos">4. Códigos y etiquetas, estampados</h2>
      <p class="sub">CUIT, categorías, series y estados en monoespaciada y mayúsculas.</p>
      <div class="sino">
        <div><span class="tag ok">Sí</span><span style="font: 700 .85rem var(--mono)">27-28901234-6 · CAT C</span></div>
        <div><span class="tag error">No</span><span>27-28901234-6 · categoría c</span></div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.regla h2 { font-size: 1rem; }
</style>
