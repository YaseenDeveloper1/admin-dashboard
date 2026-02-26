<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <main class="w-full p-6 md:p-8 bg-slate-50/50">
      <slot />
    </main>
  </div>
</template>