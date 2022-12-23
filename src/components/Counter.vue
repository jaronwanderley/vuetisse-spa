<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <button
    class="bg-slate-2/50 py-4 rounded-xl"
    @click="count++"
  >
    Count is {{ count }}
  </button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
</style>
