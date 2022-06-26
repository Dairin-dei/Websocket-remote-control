import robot from 'robotjs';
export function getMousePosition() {
  const currentMousePosition = robot.getMousePos();
  return `mouse_position ${String(currentMousePosition.x)},${String(
    currentMousePosition.y
  )}\0`;
}
