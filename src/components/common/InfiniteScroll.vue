<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  spinnerColor: {
    type: String,
    default: '#3b82f6',
  },
  spinnerSize: {
    type: Number,
    default: 42,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onLoad: {
    type: Function,
    default: () => {},
  },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const onUpdate = async () => {
  emit('update:modelValue', true)
  await props.onLoad()
  emit('update:modelValue', false)
}
const onIntersect = () => {
  if (props.modelValue || props.disabled)
    return
  onUpdate()
}
</script>

<template>
  <div v-auto-animate class="flex flex-col gap-5">
    <div>
      <slot />
    </div>
    <div
      v-intersect="onIntersect"
      class="min-h-3 flex justify-center items-center"
    >
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div v-if="modelValue && !disabled">
          <div
            v-if="!slots.spinner"
            class="spinner"
            :style="{
              '--spinner-color': spinnerColor,
              '--spinner-size': `${spinnerSize}px`,
            }"
            @click="onUpdate"
          >
            <div />
            <div />
            <div />
            <div />
          </div>
          <div v-else>
            <slot name="spinner" />
          </div>
        </div>
      </Transition>
      <div v-if="disabled">
        <h2
          v-if="!slots.over"
          class="text-xl font-bold"
        >
          No more items.
        </h2>
        <div v-else>
          <slot name="over" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  position: relative;
  width: calc(var(--spinner-size) + 2 * 8px);
  height: calc(var(--spinner-size) + 2 * 8px);
  margin-top: 8px;
}
.spinner div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: var(--spinner-size);
  height: var(--spinner-size);
  margin: 8px;
  border: 8px solid var(--spinner-color);
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--spinner-color) transparent transparent transparent;
}
.spinner div:nth-child(1) {
  animation-delay: -0.45s;
}
.spinner div:nth-child(2) {
  animation-delay: -0.3s;
}
.spinner div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
