export function handlePosition(event) {
  const { x, y, touches } = event
  const [{ clientX = 0, clientY = 0 }] = touches || [{}]

  return {
    posX: touches ? clientX : x,
    posY: touches ? clientY : y,
  }
}
