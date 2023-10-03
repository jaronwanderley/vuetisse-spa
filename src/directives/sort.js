function setDirective(el, binding) {
  const { value: options } = binding
  if (!Array.isArray(options?.items))
    throw new Error('You need to pass a List of Items to Sort Directive!')

  let draggingElement = null
  let draggingElementHandle = null
  let draggingElementIndex = null

  const draggable = 'draggable'

  const setDraggable = (element, value) => element.setAttribute(draggable, `${value}`)

  const getArray = element => ([...element])

  const isBefore = (el1, el2) => {
    if (el2.parentNode !== el1.parentNode)
      return false
    for (let cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2)
        return true
    }
  }

  const onDragStart = (event) => {
    const target = event.target
    if (target.getAttribute(draggable) !== 'true')
      return
    // `touchstart` event doesn't have `dataTransfer` property
    if (event instanceof DragEvent) {
      const { dataTransfer } = event
      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move'
        dataTransfer.setData('text/plain', '')
      }
    }
    draggingElement = target
    draggingElementHandle = options.handleClass && draggingElement.querySelector(`.${options.handleClass}`)
    draggingElementIndex = getArray(draggingElement?.parentElement?.children).indexOf(draggingElement)
    draggingElement?.parentElement?.classList.add('drag')
  }

  const onDragEnter = (event) => {
    if (!draggingElement)
      return
    const {
      target,
      type,
      preventDefault,
      stopPropagation,
    } = event
    const {
      clientX,
      clientY,
    } = get('touches', event) || [{}]
    const parentNode = draggingElement?.parentElement
    let hoverEl = target
    if (type === 'touchmove') {
      stopPropagation()
      preventDefault()
      // touch workaround; get all elements we are hovering over, then select one from the list
      hoverEl = getArray(document.elementsFromPoint(clientX, clientY))
        .find(v => getArray(draggingElement?.parentElement?.children).includes(v))
    }
    if (!parentNode?.contains(hoverEl))
      return
    draggingElement.classList.add(options.placeholderClass)
  }

  const onDragEnd = (event) => {
    const { target } = event
    if (!draggingElement)
      return
    if (draggingElementHandle)
      setDraggable(draggingElement, false)

    draggingElement.classList.remove(options.placeholderClass)
    draggingElement?.parentElement?.classList.remove('drag')
    const from = draggingElementIndex
    const to = getArray(draggingElement?.parentElement?.children).indexOf(draggingElement)
    const hoverEl = target
    const parentNode = draggingElement?.parentElement
    parentNode?.insertBefore(draggingElement, (isBefore(draggingElement, hoverEl)) ? hoverEl : hoverEl.nextSibling)
    const items = options.items || []
    items.splice(to, 0, items.splice(from, 1)[0]) // move within array
    setTimeout(() => {
      draggingElement = null
      draggingElementIndex = null
      draggingElementHandle = null
    }, 100)
  }

  const makeDraggable = (element, options) => {
    const handleElement = options.handleClass && element.querySelector(`.${options.handleClass}`)
    if (handleElement) { // handle makes item draggable
      handleElement.onmousedown = () => {
        setDraggable(element, true)
      }
      handleElement.ontouchstart = () => {
        element?.parentElement?.classList.add('drag')
        setDraggable(element, true)
      }
      handleElement.onmouseup = () => { // `dragstart` not triggered onClick, so need this to cover onClick event
        setDraggable(element, false)
      }
      handleElement.ontouchend = () => {
        element?.parentElement?.classList.remove('drag')
        setDraggable(element, false)
      }
      element.ondragend = (event) => {
        setDraggable(event.target, false)
      }
    }
    else {
      setDraggable(element, true)
    }
    element.ondragstart = onDragStart
    element.ondragenter = onDragEnter
    element.ondragend = onDragEnd
    element.ontouchstart = onDragStart
    element.ontouchmove = onDragEnter
    element.ontouchend = onDragEnd
  }

  const children = getArray(el.children)
  children.forEach((child, index) => makeDraggable(child, options.items[index]))
}

export default {
  mounted: setDirective,
  updated: setDirective,
}
