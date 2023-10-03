const state = ref(new Map())

export function notify({ message, id = Date.now(), timeout, type }) {
  state.value.set(id, {
    message,
    timeout,
    type,
    createdAt: Date.now(),
  })
  if (timeout) {
    setTimeout(() => {
      state.value.delete(id)
    }, timeout * 1000)
  }
}

export function throwError({ message, id = Date.now(), timeout = 3 }) {
  notify({ message, id, timeout, type: 'error' })
}

function remove(id) {
  state.value.delete(id)
}

const notifications = computed(() => Array.from(state.value.entries()))

export default {
  notify,
  throwError,
  remove,
  notifications,
}
