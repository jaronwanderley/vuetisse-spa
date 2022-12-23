<script setup lang="ts">
const logobase = ref(null)
const logo = ref(null)

const animateHover = () => {
  animate(logobase.value, 400, {}, { transform: { translateZ: '70px' } })
  animate(logo.value, 400, {}, { transform: { translateZ: '30px' } })
}
const animateLeave = () => {
  animate(logobase.value, 400, {}, { transform: { translateZ: '0px', rotateY: '0deg', rotateX: '0deg' } })
  animate(logo.value, 400, {}, { transform: { translateZ: '0px' } })
}
const animateMouseMove = (event: MouseEvent) => {
  const { x: posX, y: posY } = event
  const { x = 0, y = 0, width = 0, height = 0 } = logobase?.value?.getBoundingClientRect() || {}
  const rotateAmount = 45
  animate(
    logobase.value,
    300,
    {},
    {
      transform: {
        rotateY: `${rotateAmount * (((posX - x) / width) - 0.5) * 1}deg`,
        rotateX: `${rotateAmount * (((posY - y) / height) - 0.5) * -1}deg`,
        rotateZ: '0deg',
      },
    },
    easing.easeOutCubic,
  )
}
</script>

<template>
  <div>
    <a
      href="https://github.com/jaronwanderley"
      target="_blank"
      class="inline-block perspective-400 min-w-60 min-h-60"
    >
      <div
        ref="logobase"
        class="bg-slate-2/50 rounded-3xl"
        style="transform-style: preserve-3d"
        @mouseenter="animateHover"
        @mouseleave="animateLeave"
        @mousemove="animateMouseMove"
      >
        <img
          ref="logo"
          src="/jrnwn-logo.svg"
          class="logo"
          alt="Logo of the creator of this webpage"
        >
      </div>
    </a>
  </div>
</template>
