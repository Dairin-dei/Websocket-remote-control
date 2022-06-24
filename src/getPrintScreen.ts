import Jimp from 'jimp';
import robot from 'robotjs';

export async function getPrintScreen() {
  let currentMousePosition = robot.getMousePos();
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
  console.log(
    `Result: sent printscreen from {x: ${currentMousePosition.x} px},{x: ${currentMousePosition.y} px}, width: 200 px, height: 200 px`
  );
  return buffer.slice(buffer.indexOf(',') + 1);
}
