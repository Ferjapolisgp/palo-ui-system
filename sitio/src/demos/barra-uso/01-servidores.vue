<script setup>
import { BarraUso, GrillaCupos } from 'palo-ui-system';

// Datos de ejemplo: no son los servidores reales.
const servidores = [
  { nombre: 'Ticketera-01', estado: ['ok', 'En línea'], specs: ['8 núcleos', '32 GB', 'Buenos Aires'], disco: [198, 256], ram: [19, 32], cpu: 21, colas: [11, 16] },
  { nombre: 'Docs-02', estado: ['aviso', 'Exigido'], specs: ['4 núcleos', '16 GB', 'São Paulo'], disco: [231, 256], ram: [14.2, 16], cpu: 97, colas: [15, 16] },
];
</script>

<template>
  <div class="lista">
    <article v-for="s in servidores" :key="s.nombre" class="servidor">
      <header>
        <h3><i class="punto" :class="s.estado[0]"></i>{{ s.nombre }}</h3>
        <span class="tag" :class="s.estado[0]">{{ s.estado[1] }}</span>
        <span class="specs">{{ s.specs.join(' · ') }}</span>
      </header>
      <div class="medidas">
        <BarraUso etiqueta="Disco" :valor="s.disco[0]" :total="s.disco[1]" unidad=" GB" />
        <BarraUso etiqueta="Memoria" :valor="s.ram[0]" :total="s.ram[1]" unidad=" GB" />
        <BarraUso etiqueta="CPU en uso" :valor="s.cpu" />
        <GrillaCupos :usados="s.colas[0]" :total="s.colas[1]" etiqueta="Colas de trabajo" />
      </div>
    </article>
  </div>
</template>

<style scoped>
.lista { display: grid; gap: 10px; width: 100%; }
.servidor { display: grid; gap: 14px; padding: 16px 18px; background: var(--panel); border: 1px solid var(--borde); border-radius: var(--r-lg); }
header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
h3 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 1.15rem; letter-spacing: -.01em; }
.punto { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
.punto.aviso { background: var(--aviso); }
.specs { font: 500 .68rem var(--mono); letter-spacing: .06em; text-transform: uppercase; color: var(--sub); }
.medidas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) auto; gap: 18px 28px; align-items: end; }
@media (max-width: 720px) { .medidas { grid-template-columns: minmax(0, 1fr); } }
</style>
