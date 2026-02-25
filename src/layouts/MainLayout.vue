<script setup>
import Navbar from '../components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <Navbar />
    <main class="p-6 md:p-8 max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>