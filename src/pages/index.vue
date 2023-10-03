<script setup>
let posts = $ref({})
const loadPosts = () => posts = postService.getPosts()

let postCount = $ref({})
const loadPostCount = () => postCount = postService.getPostsCount()

onMounted(() => {
  loadPosts()
  loadPostCount()
})
</script>

<template>
  <Counter />
  <div>{{ posts.loading ? 'Carregando...' : 'carregou!' }}</div>
  <div v-if="!posts.loading && !postCount.loading">
    Posts count is {{ posts.data?.length || 0}} or  {{ postCount.data }}
  </div>
</template>
