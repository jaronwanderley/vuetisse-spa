export const handlePosition = (event: MouseEvent | TouchEvent) => {
  const x = get('x', event)
  const y = get('y', event)
  const touches = get('touches', event)
  const [{ clientX = 0, clientY = 0 }] = touches || [{}]

  return {
    posX: touches ? clientX : x,
    posY: touches ? clientY : y,
  }
}
