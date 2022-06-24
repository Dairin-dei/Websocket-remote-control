import { httpServer } from './src/http_server/index';
import { WebSocketServer } from 'ws';
import { getPrintScreen } from './src/getPrintScreen';
import { executeMouseNavigation } from './src/navigation';
import { executeDraw } from './src/draw';
import { getMousePosition } from './src/mouseCoordinates';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on('connection', (ws) => {
  console.log('Start Web socket server on the 8080 port!');
  ws.on('message', async (data) => {
    console.log('received: %s', data);
    const dataConverted = ` ${data}`.trim();

    const arrData = dataConverted.split(' ');
    let cmd: string = arrData[0];

    if (cmd === 'mouse_position') {
      const { x, y } = getMousePosition();
      ws.send(`${cmd} ${String(x)},${String(y)}\0`);

      console.log(`Result: mouse-position is {${x} px},{${y} px}`);
    } else if (cmd.indexOf('mouse_') >= 0) {
      executeMouseNavigation(cmd, arrData);
    } else if (cmd.indexOf('draw_') >= 0) {
      executeDraw(cmd, arrData);
    } else {
      const buffer = await getPrintScreen();
      ws.send(`prnt_scrn ${buffer}\0`);
    }
  });
});

wsServer.on('close', () => {
  console.log('Bye!');
});
