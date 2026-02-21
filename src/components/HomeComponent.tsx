'use client';

import { useRef } from "react";

// type OCRPostReturn = {
//   status: 'success' | 'error';
//   message: string;
//   text_data: Array<{
//     text: string;
//     bounding_box: {
//       x0: number;
//       y0: number;
//       x1: number;
//       y1: number;
//     };
//   }>;
// }

export default function HomeComponent() {
  // create an HTML canvas
  // load an image into it
  // background text
  // write text into

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImageData = (imageData: string) => {
    const testingData = [
      { text: 'Hello, world!', bounding_box: { x0: 0, y0: 0, x1: 100, y1: 100 } },
    ];
    
    const canvas = canvasRef.current;
    if (canvas) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0);
        for (const text of testingData) {
          ctx.fillStyle = "white";
          ctx.fillRect(text.bounding_box.x1, text.bounding_box.y1, text.bounding_box.x1-text.bounding_box.x0, text.bounding_box.y1-text.bounding_box.y0);

          let fontSize = 12;
          ctx.font = `${fontSize}px OpenDyslexic`;
          const metrics = ctx.measureText(text.text);
          const ratio = Math.min((text.bounding_box.x1 - text.bounding_box.x0) / metrics.width, (text.bounding_box.y1 - text.bounding_box.y0) / fontSize);
          fontSize = Math.floor(ratio * fontSize);

          ctx.fillStyle = "black";
          ctx.font = `${fontSize}px OpenDyslexic`;
          ctx.fillText(text.text, text.bounding_box.x0 + (text.bounding_box.x1 - text.bounding_box.x0) / 2 - ctx.measureText(text.text).width / 2, text.bounding_box.y0 + (text.bounding_box.y1 - text.bounding_box.y0) / 2 - fontSize / 2);
        }
      };
      img.src = imageData;
    }

  }

  // for each rectangle of text: 
  // get coords of corners
  // find length of text after converting font
  // determine optimal font size

  return (
    <div>
      <canvas id="canvas" width="800" height="600"></canvas>
    </div>
  );
}