<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
  <Navbar />
  <div class="p-8 bg-gray-100 min-h-screen">
    <slot />
  </div>
</template>