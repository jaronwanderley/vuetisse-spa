const state = ref(new Map())

interface NotificationOptions {
  message: string
  id?: number | string
  timeout?: number
  type?: string
}

const notify = ({ message, id = Date.now(), timeout, type }: NotificationOptions) => {
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

const throwError = ({ message, id = Date.now(), timeout = 3 }: NotificationOptions) => {
  notify({ message, id, timeout, type: 'error' })
}

const remove = (id: number | string) => {
  state.value.delete(id)
}

const notifications = computed(() => Array.from(state.value.entries()))

export default {
  notify,
  throwError,
  remove,
  notifications,
}
