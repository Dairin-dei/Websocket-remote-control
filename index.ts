import { httpServer } from './src/http_server/index';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { getPrintScreen } from './src/getPrintScreen';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 8080 });

const screenHeight = robot.getScreenSize().height;
const screenWidth = robot.getScreenSize().width;

wsServer.on('connection', (ws) => {
  console.log('Start Web socket server on the 8080 port!');
  ws.on('message', async (data) => {
    console.log('received: %s', data);
    const dataConverted = ` ${data}`.trim();

    const arrData = dataConverted.split(' ');
    let cmd: string = arrData[0];
    let dataClient: number = 0;
    let width: number = 0;
    let height: number = 0;
    if (arrData.length > 2) {
      width = Number(arrData[1]);
      height = Number(arrData[2]);
    } else if (arrData.length > 1) {
      dataClient = Number(arrData[1]);
    }

    let currentMousePosition = robot.getMousePos();
    let cmdType: string = '';
    if (cmd.indexOf('mouse_') > 0) {
      cmdType = 'navigate';
    } else if (cmd.indexOf('draw_') > 0) {
      cmdType = 'draw';
    } else {
      cmdType = 'screen';
    }

    switch (cmdType) {
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
      case 'mouse_position':
        ws.send(
          `${cmd} ${String(currentMousePosition.x)},${String(
            currentMousePosition.y
          )}\0`
        );
        currentMousePosition = robot.getMousePos();
        console.log(
          `Result: mouse-position is {${currentMousePosition.x} px},{${currentMousePosition.y} px}`
        );
        break;
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
      case 'prnt_scrn':
        //добавить проверку на выход за пределы экрана
        const buffer = await getPrintScreen(currentMousePosition);
        ws.send(`prnt_scrn ${buffer}`);
        console.log(
          `Result: sent printscreen from {x: ${currentMousePosition.x} px},{x: ${currentMousePosition.y} px}, width: 200 px, height: 200 px`
        );
        break;
    }
  });
});

wsServer.on('close', () => {
  console.log('Bye!');
});
