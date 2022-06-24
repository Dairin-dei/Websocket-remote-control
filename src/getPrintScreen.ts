import Jimp from 'jimp';
import robot from 'robotjs';

export async function getPrintScreen(currentMousePosition: {
  x: number;
  y: number;
}) {
  const printScreen = robot.screen.capture(
    currentMousePosition.x - 100,
    currentMousePosition.y - 100,
    200,
    200
  );

  const jimpData = new Jimp({
    data: printScreen.image,
    width: 200,
    height: 200,
  });

  const buffer = await jimpData.getBase64Async(Jimp.MIME_PNG);
  return buffer.slice(buffer.indexOf(',') + 1);
}
