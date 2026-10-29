<script setup>
import { Avatar } from 'palo-ui-system';
</script>

<template>
  <Avatar nombre="Ana Ruiz" />
  <Avatar nombre="Mariana Sosa" :tam="32" />
  <Avatar nombre="Lucas Gómez" :tam="44" />
  <Avatar :tam="32" />
</template>
