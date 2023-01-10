import type { Plugin } from 'vue'

const setDirective = (el: HTMLElement, binding: any) => {
  const { value: options } = binding

  let draggingElement: HTMLElement | null = null
  let draggingElementHandle: HTMLElement | null = null
  let draggingElementIndex: number | null = null

  const draggable = 'draggable'

  const setDraggable = (element: HTMLElement, value: Object) => element.setAttribute(draggable, `${value}`)

  const getArray = (element: any) => ([...element])

  const isBefore = (el1: HTMLElement, el2: HTMLElement) => {
    if (el2.parentNode !== el1.parentNode)
      return false
    for (let cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2)
        return true
    }
  }

  const onDragStart = (event: DragEvent | TouchEvent) => {
    const target = event.target as HTMLElement
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

  const onDragEnter = (event: DragEvent | TouchEvent) => {
    if (!draggingElement)
      return
    const {
      target,
      type,
      preventDefault,
      stopPropagation,
    } = event
    const touches = (event instanceof TouchEvent) ? event.touches : []
    let hoverEl = target
    if (type === 'touchmove') {
      stopPropagation()
      preventDefault()
      // touch workaround; get all elements we are hovering over, then select one from the list
      const {
        clientX,
        clientY,
      } = touches[0]
      hoverEl = getArray(document.elementsFromPoint(clientX, clientY))
        .find(v => getArray(draggingElement?.parentElement?.children).includes(v))
    }
    // if (hoverEl === draggingElement) return
    if (!getArray(draggingElement?.parentElement?.children).includes(hoverEl))
      return
    draggingElement.classList.add(options.placeholderClass)
    const node = hoverEl as HTMLElement
    node?.parentNode?.insertBefore(draggingElement, (isBefore(draggingElement, node)) ? node : node.nextSibling)
  }

  const onDragEnd = () => {
    if (!draggingElement)
      return
    if (draggingElementHandle)
      setDraggable(draggingElement, false)

    draggingElement.classList.remove(options.placeholderClass)
    draggingElement?.parentElement?.classList.remove('drag')
    const from = draggingElementIndex
    const to = getArray(draggingElement?.parentElement?.children).indexOf(draggingElement)
    const items = options.items || []
    items.splice(to, 0, items.splice(from, 1)[0]) // move within array
    setTimeout(() => {
      draggingElement = null
      draggingElementIndex = null
      draggingElementHandle = null
    }, 0)
  }

  const makeDraggable = (element: HTMLElement, options: any) => {
    const handleElement = options.handleClass && element.querySelector(`.${options.handleClass}`) as HTMLElement
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
      element.ondragend = (event: DragEvent) => {
        setDraggable(event.target as HTMLElement, false)
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
  children.forEach((child: HTMLElement, index: number) => makeDraggable(child, options.items[index]))
}

const sortDirective = {
  mounted: setDirective,
  updated: setDirective,
}

export const sortPlugin: Plugin = {
  install(app) {
    app.directive('sort', sortDirective)
  },
}
