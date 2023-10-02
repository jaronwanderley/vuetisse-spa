function mounted(el, binding) {
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
    entries = [],
    observer,
  ) => {
    const _observe = el._observe?.[binding.instance.$.uid]
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
  el._observe[binding.instance.$.uid] = { init: false, observer }

  observer.observe(el)
}

function unmounted(el, binding) {
  const observe = el._observe?.[binding.instance.$.uid]
  if (!observe)
    return

  observe.observer.unobserve(el)
  delete el._observe[binding.instance.$.uid]
}

export const Intersect = {
  mounted,
  unmounted,
}

export default Intersect
