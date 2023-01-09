<script setup lang="ts">
const { notifications, remove } = $Notification
const count = computed(() => Object.keys(notifications.value).length)
</script>

<template>
  <div
    :class="{
      '-translate-y-full': count === 0,
    }"
    class="fixed top-0 left-0 right-0 min-h-50 bg-gradient-to-b from-orange/50 to-orange/0 pointer-events-none transition duration-2000 ease-out opacity-100"
  />
  <div
    v-auto-animate
    class="fixed top-0 left-0 right-0 flex flex-col items-center gap-3 p-3 pointer-events-none transform transition duration-300 ease-out translate-0 z-1000"
  >
    <div
      v-for="[index, { message, timeout, createdAt, type }] in notifications"
      :key="createdAt"
      :class="{
        'bg-white': type !== 'error',
        'bg-red-4 text-white': type === 'error',
      }"
      class="grid grid-cols-[1fr_28px] gap-2 w-full max-w-120 pointer-events-auto p-2 text-xs rounded-xl shadow-orange-7/10 shadow-lg"
    >
      <div class="flex text-left items-center px-2">
        {{ message }}
      </div>
      <div class="relative right-0 top-0 h-7 aspect-square bg-slate-4/20 hover:bg-blue rounded-full flex justify-center items-center cursor-pointer transition duration-300 ease-out">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          class="fill-none stroke-current stroke-2 stroke-round"
          @click="remove(index)"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <TimeoutBar
        v-if="timeout"
        :timeout="timeout"
        :type="type"
        class="col-span-2"
      />
    </div>
  </div>
</template>
