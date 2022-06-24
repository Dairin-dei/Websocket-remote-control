import { httpServer } from './src/http_server/index';
import { WebSocketServer } from 'ws';
import { getPrintScreen } from './src/getPrintScreen';
import { executeMouseNavigation } from './src/navigation';
import { executeDraw } from './src/draw';
import { getMousePosition } from './src/mouseCoordinates';
import { Readable, Writable } from 'stream';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on('connection', (ws) => {
  console.log('Start Web socket server on the 8080 port!');
  ws.on('message', async (data) => {
    const readStream = Readable.from(data.toString(), { encoding: 'utf8' });

    readStream.on('data', async (readMessage) => {
      console.log('received: %s', readMessage);

      const arrData = ` ${readMessage}`.trim().split(' ');
      let cmd: string = arrData[0];

      if (cmd === 'mouse_position') {
        const message = getMousePosition();
        const writeStream = new Writable({
          write: function (chunk, encoding, done) {
            ws.send(chunk.toString());
            done();
          },
        });

        writeStream.write(message, 'utf-8', () => {
          console.log(`Result: ${message}`);
        });
      } else if (cmd.indexOf('mouse_') >= 0) {
        executeMouseNavigation(cmd, arrData);
      } else if (cmd.indexOf('draw_') >= 0) {
        executeDraw(cmd, arrData);
      } else {
        const result = await getPrintScreen();

        const writeStream = new Writable({
          write: function (chunk, encoding, done) {
            ws.send(chunk.toString());
            done();
          },
        });

        writeStream.write(result.message, 'utf-8', () => {
          console.log(
            `Result: print screen from x: ${result.x}, y: ${result.y}`
          );
        });
      }
    });
  });
});

wsServer.on('close', () => {
  console.log('Bye!');
});
