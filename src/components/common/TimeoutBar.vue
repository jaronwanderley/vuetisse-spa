<script setup>
const props = defineProps({
  timeout: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  type: {
    type: String,
    default: 'default',
  },
})

const bar = ref(null)

watchEffect(() => {
  if (bar.value === null)
    return
  if (props.timeout >= Number.POSITIVE_INFINITY)
    return
  animate(bar.value, props.timeout * 1000, { transform: { scaleX: '100%' } }, { transform: { scaleX: '0%' } })
})
</script>

<template>
  <div class="w-full h-1 rounded-lg bg-slate-5/20 overflow-hidden">
    <div
      ref="bar"
      :class="{
        'bg-orange': type === 'default',
        'bg-white/80': type === 'error',
      }"
      class="w-full h-full origin-left"
    />
  </div>
</template>
