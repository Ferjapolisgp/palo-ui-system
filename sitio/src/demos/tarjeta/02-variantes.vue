<script setup>
import { ref } from 'vue';
import { GraficoLinea, Interruptor, Tarjeta } from 'palo-ui-system';
import { ultimos14 } from '../../datos/ejemplo.js';

const cargando = ref(false);
</script>

<template>
  <div class="todo">
    <Interruptor v-model="cargando">Cargando</Interruptor>
    <div class="grilla">
      <Tarjeta titulo="Contorno" subtitulo="LISTAS" :cargando="cargando">
        Para listas y grillas: es la variante de siempre.
      </Tarjeta>
      <Tarjeta titulo="Plana" subtitulo="DENTRO DE OTRA" variante="plana" :cargando="cargando">
        Sin borde, para usarla sobre una superficie que ya tiene el suyo.
      </Tarjeta>
      <Tarjeta titulo="Elevada" subtitulo="FLOTA" variante="elevada" :cargando="cargando">
        Con sombra: algo que está por encima del resto.
      </Tarjeta>
      <Tarjeta titulo="Vencida" subtitulo="TK-1039" tono="error" :cargando="cargando">
        <template #extra><span class="tag error">Vencida</span></template>
        El acento de color acompaña a la etiqueta, nunca la reemplaza.
      </Tarjeta>
      <Tarjeta titulo="Por vencer" subtitulo="TK-1037" tono="aviso" compacta :cargando="cargando">
        <template #extra><span class="tag aviso">Por vencer</span></template>
        Versión compacta, para listas largas.
      </Tarjeta>
      <Tarjeta titulo="Con gráfico" subtitulo="ÚLTIMOS 14 DÍAS" class="doble" :cargando="cargando">
        <template #media>
          <div class="media"><GraficoLinea :datos="ultimos14" x="fecha" y="cantidad" etiqueta="Ingresadas" descripcion="Solicitudes ingresadas por día en las últimas dos semanas" :alto="110" :formato-x="(d) => d.getDate()" /></div>
        </template>
        El slot media va arriba de todo, a todo el ancho.
      </Tarjeta>
    </div>
  </div>
</template>

<style scoped>
.todo { display: grid; gap: 14px; width: 100%; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; align-items: start; }
.media { padding: 8px 10px 0; }
.doble { grid-column: 1 / -1; }
</style>
