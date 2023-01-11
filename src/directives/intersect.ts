// Utils
import type {
  DirectiveBinding,
} from 'vue'

// Types

type ObserveHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void

export interface ObserveDirectiveBinding extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
  value?: ObserveHandler | { handler: ObserveHandler; options?: IntersectionObserverInit }
  modifiers: {
    once?: boolean
    quiet?: boolean
  }
}

interface IODElement extends HTMLElement {
  _observe?: any
}

function mounted(el: IODElement, binding: ObserveDirectiveBinding) {
  if (!('IntersectionObserver' in window)
  || !('IntersectionObserverEntry' in window)
  || !('intersectionRatio' in window.IntersectionObserverEntry.prototype)
  || !('isIntersecting' in window.IntersectionObserverEntry.prototype))
    return

  const modifiers = binding.modifiers || {}
  const value = binding.value
  const { handler, options } = typeof value === 'object'
    ? value
    : { handler: value, options: {} }

  const observer = new IntersectionObserver((
    entries: IntersectionObserverEntry[] = [],
    observer: IntersectionObserver,
  ) => {
    const _observe = el._observe?.[binding.instance!.$.uid]
    if (!_observe)
      return // Just in case, should never fire

    const isIntersecting = entries.some(entry => entry.isIntersecting)

    // If is not quiet or has already been
    // initted, invoke the user callback
    if (
      handler && (
        !modifiers.quiet
        || _observe.init
      ) && (
        !modifiers.once
        || isIntersecting
        || _observe.init
      )
    )
      handler(isIntersecting, entries, observer)

    if (isIntersecting && modifiers.once)
      unmounted(el, binding)
    else _observe.init = true
  }, options)

  el._observe = Object(el._observe)
  el._observe![binding.instance!.$.uid] = { init: false, observer }

  observer.observe(el)
}

function unmounted(el: IODElement, binding: ObserveDirectiveBinding) {
  const observe = el._observe?.[binding.instance!.$.uid]
  if (!observe)
    return

  observe.observer.unobserve(el)
  delete el._observe![binding.instance!.$.uid]
}

export const Intersect = {
  mounted,
  unmounted,
}

export default Intersect
