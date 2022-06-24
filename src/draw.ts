import robot from 'robotjs';

export function executeDraw(cmd: string, arrData: Array<string | number>) {
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
  switch (cmd) {
    case 'draw_circle':
      //добавить проверку на выход за пределы экрана
      robot.moveMouse(
        currentMousePosition.x + dataClient,
        currentMousePosition.y
      );
      robot.mouseToggle('down');
      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        const x = currentMousePosition.x + dataClient * Math.cos(i);
        const y = currentMousePosition.y + dataClient * Math.sin(i);
        robot.dragMouse(x, y);
      }
      robot.mouseToggle('up');
      console.log(
        `Result: circle at {x: ${currentMousePosition.x} px},{x: ${currentMousePosition.y} px}, radius: ${dataClient} px`
      );
      break;
    case 'draw_square':
      //добавить проверку на выход за пределы экрана
      robot.mouseToggle('down');
      for (
        let x = currentMousePosition.x;
        x <= currentMousePosition.x + dataClient;
        x += 0.5
      ) {
        robot.dragMouse(x, currentMousePosition.y);
      }
      for (
        let y = currentMousePosition.y;
        y <= currentMousePosition.y + dataClient;
        y += 0.5
      ) {
        robot.dragMouse(currentMousePosition.x + dataClient, y);
      }
      for (
        let x = currentMousePosition.x + dataClient;
        x >= currentMousePosition.x;
        x -= 0.5
      ) {
        robot.dragMouse(x, currentMousePosition.y + dataClient);
      }
      for (
        let y = currentMousePosition.y + dataClient;
        y >= currentMousePosition.y;
        y -= 0.5
      ) {
        robot.dragMouse(currentMousePosition.x, y);
      }
      robot.mouseToggle('up');
      console.log(
        `Result: square at {x: ${currentMousePosition.x} px},{x: ${currentMousePosition.y} px}, width: ${dataClient} px, height: ${dataClient} px`
      );
      break;
    case 'draw_rectangle':
      //добавить проверку на выход за пределы экрана
      robot.mouseToggle('down');
      for (
        let x = currentMousePosition.x;
        x <= currentMousePosition.x + width;
        x += 0.5
      ) {
        robot.dragMouse(x, currentMousePosition.y);
      }
      for (
        let y = currentMousePosition.y;
        y <= currentMousePosition.y + height;
        y += 0.5
      ) {
        robot.dragMouse(currentMousePosition.x + width, y);
      }
      for (
        let x = currentMousePosition.x + width;
        x >= currentMousePosition.x;
        x -= 0.5
      ) {
        robot.dragMouse(x, currentMousePosition.y + height);
      }
      for (
        let y = currentMousePosition.y + height;
        y >= currentMousePosition.y;
        y -= 0.5
      ) {
        robot.dragMouse(currentMousePosition.x, y);
      }
      robot.mouseToggle('up');
      console.log(
        `Result: rectangular at {x: ${currentMousePosition.x} px},{x: ${currentMousePosition.y} px}, width: ${width} px, height: ${height} px`
      );
      break;
  }
}
