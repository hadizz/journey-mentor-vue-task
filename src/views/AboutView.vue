<script setup lang="ts"></script>

<template>
  <div class="about">
    <h1>TanStack Query Demo</h1>
    <p>
      This page demonstrates advanced TanStack Query features including search, caching, and
      prefetching.
    </p>
  </div>
</template>

<style scoped>
.about {
  padding: 20px;
}

.about h1 {
  text-align: center;
  margin-bottom: 16px;
  color: #2c3e50;
}

.about p {
  text-align: center;
  margin-bottom: 32px;
  color: #666;
  font-size: 1.1rem;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    padding: 40px;
  }
}
</style>
