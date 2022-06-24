import robot from 'robotjs';
export function getMousePosition() {
  const currentMousePosition = robot.getMousePos();
  return { x: currentMousePosition.x, y: currentMousePosition.y };
}
