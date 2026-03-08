<script setup lang="ts">
import { Boids } from '../src/index'
</script>

<template>
  <div class="playground">
    <Boids debug />
  </div>
</template>

<style>
.playground {
  width: 100vw;
  height: 100vh;
}
</style>
