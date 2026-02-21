'use client';

import { OCRPostReturn } from "@/app/api/ocr/route";
import { request } from "@/lib/api";
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
      };
      img.src = imageData;
    }

    for (const text of testingData) {
      
      // draw rectangel on canvas
      // write text

      ctx.fillStyle = "white";
      ctx.fillRect = (text.bounding_box.x1, text.bounding_box.y1, text.bounding_box.x1-text.bounding_box.x0, text.bounding_box.y1-text.bounding_box.y0);

      let fontSize = 12;
      ctx.font = `${fontSize}px OpenDyslexic`;
      const metrics = ctx.measureText(text.text);
      const ratio = Math.min((text.bounding_box.x1 - text.bounding_box.x0) / metrics.width, (text.bounding_box.y1 - text.bounding_box.y0) / fontSize);
      fontSize = Math.floor(ratio * fontSize);

      ctx.fillStyle = "black";
      ctx.font = `${fontSize}px OpenDyslexic`;
      ctx.fillText(text.text, text.bounding_box.x0 + (text.bounding_box.x1 - text.bounding_box.x0) / 2 - ctx.measureText(text.text) / 2, text.bounding_box.y0 + (text.bounding_box.y1 - text.bounding_box.y0) / 2 - fontSize / 2);
      

    }

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Loading file
      const form = e.target as HTMLFormElement;
      const fileInput = form.elements.namedItem('image') as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select an image.');  // TODO: NOTIFICATION
        return;
      }

      // Processing file
      const binaryImage = fileInput.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        try {
          // OCR
          const formData = new FormData();
          formData.append('image', binaryImage);
          const res = await request<OCRPostReturn>({ type: 'POST', route: '/api/ocr', body: formData });
          console.log(`development:`, res.status, res.message, res.text_data);

          // Draw Image
          if (res.status === 'success' && res.text_data) drawImageData(base64Image); // drawImageData(base64Image, res.text_data);
        } catch (e: any) {
          alert('Upload failed'); // TODO: NOTIFICATION
        }
      };
      reader.readAsDataURL(binaryImage);
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