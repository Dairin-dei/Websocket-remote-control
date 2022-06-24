import robot from 'robotjs';

export function executeMouseNavigation(
  cmd: string,
  arrData: Array<string | number>
) {
  let currentMousePosition = robot.getMousePos();

  let dataClient: number = 0;
  let width: number = 0;
  let height: number = 0;

  if (arrData.length > 2) {
    width = Number(arrData[1]);
    height = Number(arrData[2]);
  } else if (arrData.length > 1) {
    dataClient = Number(arrData[1]);
  }

  const screenHeight = robot.getScreenSize().height;
  const screenWidth = robot.getScreenSize().width;

  switch (cmd) {
    case 'mouse_up':
      robot.moveMouse(
        currentMousePosition.x,
        Math.max(0, currentMousePosition.y - dataClient)
      );

      currentMousePosition = robot.getMousePos();
      console.log(
        `Result: mouse up to {${currentMousePosition.x} px},{${currentMousePosition.y} px}`
      );
      break;
    case 'mouse_down':
      robot.moveMouse(
        currentMousePosition.x,
        Math.min(screenHeight, currentMousePosition.y + dataClient)
      );
      currentMousePosition = robot.getMousePos();
      console.log(
        `Result: mouse down to {${currentMousePosition.x} px},{${currentMousePosition.y} px}`
      );
      break;
    case 'mouse_right':
      robot.moveMouse(
        Math.min(screenWidth, currentMousePosition.x + dataClient),
        currentMousePosition.y
      );
      currentMousePosition = robot.getMousePos();
      console.log(
        `Result: mouse right to {${currentMousePosition.x} px},{${currentMousePosition.y} px}`
      );
      break;
    case 'mouse_left':
      robot.moveMouse(
        Math.max(0, currentMousePosition.x) - dataClient,
        currentMousePosition.y
      );
      currentMousePosition = robot.getMousePos();
      console.log(
        `Result: mouse left to {${currentMousePosition.x} px},{${currentMousePosition.y} px}`
      );
      break;
  }
}
