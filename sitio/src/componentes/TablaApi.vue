<script setup>
// Tabla de API: la primera columna y las intermedias en código; la última es la descripción.
defineProps({ columnas: { type: Array, required: true }, filas: { type: Array, required: true } });
</script>

<template>
  <div class="tabla-simple">
    <table>
      <thead><tr><th v-for="c in columnas" :key="c">{{ c }}</th></tr></thead>
      <tbody>
        <tr v-for="f in filas" :key="f[0]">
          <td v-for="(c, j) in f" :key="j" :class="{ sub: j === f.length - 1 }"><code v-if="j < f.length - 1">{{ c }}</code><template v-else>{{ c }}</template></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table { min-width: 520px; }
td { height: auto !important; padding-block: 10px !important; vertical-align: top; }
</style>
