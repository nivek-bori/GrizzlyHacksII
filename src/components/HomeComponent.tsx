'use client';

import { CloudVisionPostReturn } from '@/app/api/cloud_vision/route';
import { request } from '@/lib/api';
import { CloudVisionTextDetection } from '@/types/types';
import { useRef } from 'react';

type OCRPostReturn = {
  status: 'success' | 'error';
  message: string;
  text_data?: Array<{
    text: string;
    bounding_box: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
};

export default function HomeComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateFontSize = async (ctx: CanvasRenderingContext2D, text: string, maxY: number, maxX: number) => {
    let fontSize = 12;
    await document.fonts.load(`${fontSize}px "OpenDyslexic"`);
    await document.fonts.ready;
    ctx.font = `${fontSize}px OpenDyslexic`;
    const metrics = ctx.measureText(text);
    let fontX = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    fontX = fontX + Math.min(fontX, 2.2 * Math.pow(Math.max(0, 20 / fontX), 3));
    const fontY = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const ratio = Math.min(maxX / fontX, maxY / fontY);
    fontSize = Math.floor(ratio * fontSize);
    
    ctx.font = `${fontSize}px OpenDyslexic`;
    const finalMetrics = ctx.measureText(text);
    const finalFontX = finalMetrics.actualBoundingBoxLeft + finalMetrics.actualBoundingBoxRight;
    const finalFontY = finalMetrics.actualBoundingBoxAscent + finalMetrics.actualBoundingBoxDescent;
    if (finalFontX > maxX) console.log(`error num 1`, finalFontX, maxX);
    if (finalFontY > maxY) console.log(`error num 2`, finalFontY, maxY);

    console.log(`testing 1`, text, maxX / fontX, maxY / fontY, `--`, maxX, fontX, maxY, fontY, `--`, maxX - ratio * fontX, maxY - ratio * fontY, ratio === maxX / fontX, '--', maxX - finalFontX, maxY - finalFontY, finalFontY, finalFontY);

    return {
      fontSize,
      excessX: 0,
      excessY: maxY - finalFontY,
    };
  }

  const fillCloudVisionRectangle = (ctx: CanvasRenderingContext2D, text: CloudVisionTextDetection) => {
    ctx.fillStyle = 'white';
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(text.bounding_box.x0, text.bounding_box.y0);
    ctx.lineTo(text.bounding_box.x1, text.bounding_box.y1);
    ctx.lineTo(text.bounding_box.x2, text.bounding_box.y2);
    ctx.lineTo(text.bounding_box.x3, text.bounding_box.y3);
    ctx.lineTo(text.bounding_box.x0, text.bounding_box.y0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // TODO: REMOVE TESTING
    // const { x0, y0, x1, y1, x2, y2, x3, y3 } = text.bounding_box;
    // ctx.beginPath();
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.moveTo(x0, y0);
    // ctx.lineTo(x1, y1);
    // ctx.lineTo(x2, y2);
    // ctx.lineTo(x3, y3);
    // ctx.lineTo(x0, y0);
    // ctx.closePath();
    // ctx.stroke();
    // TODO: REMOVE TESTING
  }

  const drawCloudVisionText = async (ctx: CanvasRenderingContext2D, text: CloudVisionTextDetection) => {
    // Angle & Minimum Height
    const e0Distance = Math.sqrt((text.bounding_box.x0 - text.bounding_box.x1) ** 2 + (text.bounding_box.y0 - text.bounding_box.y1) ** 2);
    const e1Distance = Math.sqrt((text.bounding_box.x1 - text.bounding_box.x2) ** 2 + (text.bounding_box.y1 - text.bounding_box.y2) ** 2);
    const e2Distance = Math.sqrt((text.bounding_box.x2 - text.bounding_box.x3) ** 2 + (text.bounding_box.y2 - text.bounding_box.y3) ** 2);
    const e3Distance = Math.sqrt((text.bounding_box.x3 - text.bounding_box.x0) ** 2 + (text.bounding_box.y3 - text.bounding_box.y0) ** 2);

    const maxDistance = Math.max(e0Distance, e1Distance, e2Distance, e3Distance);
    const isE0Longest = maxDistance === e0Distance || maxDistance === e2Distance;

    let angleRadians = 0;
    let minY = 0;
    let minX = 0;
    if (isE0Longest) {
      const e0MinY = Math.min(text.bounding_box.y0, text.bounding_box.y1);
      const e2MinY = Math.min(text.bounding_box.y2, text.bounding_box.y3);

      if (e0MinY < e2MinY) { // e0 is top, e2 is bottom
        angleRadians = Math.atan((text.bounding_box.y1 - text.bounding_box.y0) / (text.bounding_box.x1 - text.bounding_box.x0));
      } else { // e2 is top, e0 is bottom
        angleRadians = Math.atan((text.bounding_box.y0 - text.bounding_box.y3) / (text.bounding_box.x0 - text.bounding_box.x3));
      }

      minY = Math.min(e1Distance, e3Distance);
      minX = Math.min(e0Distance, e2Distance);
    } else {
      const e1MinY = Math.min(text.bounding_box.y1, text.bounding_box.y2);
      const e3MinY = Math.min(text.bounding_box.y3, text.bounding_box.y0);

      if (e1MinY < e3MinY) { // e1 is top, e3 is bottom
        angleRadians = Math.atan((text.bounding_box.y2 - text.bounding_box.y1) / (text.bounding_box.x2 - text.bounding_box.x1));
      } else { // e3 is top, e1 is bottom
        angleRadians = Math.atan((text.bounding_box.y1 - text.bounding_box.y0) / (text.bounding_box.x1 - text.bounding_box.x0));
      }

      minY = Math.min(e0Distance, e2Distance);
      minX = Math.min(e1Distance, e3Distance);
    }

    // Maximum font size
    const { fontSize, excessX, excessY } = await calculateFontSize(ctx, text.text, minY, minX * 0.90);
    
    ctx.save();
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.font = `${fontSize}px "OpenDyslexic", Arial, sans-serif`;
    ctx.translate(text.bounding_box.x0, text.bounding_box.y0);
    ctx.rotate(angleRadians);
    ctx.translate(excessX / 2, excessY / 2);
    ctx.fillText(text.text, 0, 0);
    ctx.restore(); 
  }

  const drawImageData = (imageData: string, textData: NonNullable<OCRPostReturn['text_data']> | NonNullable<CloudVisionPostReturn['text_data']>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      ctx.save();

      for (const text of textData) {
        if ('x2' in text.bounding_box && 'y2' in text.bounding_box && 'x3' in text.bounding_box && 'y3' in text.bounding_box) {
          // Cloud Vision
          fillCloudVisionRectangle(ctx, text as CloudVisionTextDetection);
          drawCloudVisionText(ctx, text as CloudVisionTextDetection);
        } else {
          // Tesseract
          ctx.fillStyle = 'white';
          ctx.fillRect(
            text.bounding_box.x0,
            text.bounding_box.y0,
            text.bounding_box.x1 - text.bounding_box.x0,
            text.bounding_box.y1 - text.bounding_box.y0
          );

          const fontSize = await calculateFontSize(ctx, text.text, text.bounding_box.x1 - text.bounding_box.x0, text.bounding_box.y1 - text.bounding_box.y0);
          ctx.font = `${fontSize}px "OpenDyslexic", Arial, sans-serif`;
          ctx.fillStyle = 'black';
          ctx.fillText(
            text.text,
            text.bounding_box.x0 + (text.bounding_box.x1 - text.bounding_box.x0) / 2 - ctx.measureText(text.text).width / 2,
            text.bounding_box.y0 + (text.bounding_box.y1 - text.bounding_box.y0) / 2 - fontSize / 2
          );
        }
      }
    };
    img.src = imageData;
  };

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
        const res = await request<OCRPostReturn>({ type: 'POST', route: '/api/cloud_vision', body: formData });
        console.log(`development:`, res.status, res.message, res.text_data);

        // Draw Image
        drawImageData(base64Image, res.text_data ?? []);
      } catch (e: any) {
        drawImageData(base64Image, []);
        alert('Upload failed');
      }
    };
    reader.readAsDataURL(binaryImage);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleUpload}
      >
        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Image
        </button>
      </form>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded shadow-sm max-w-full"
        style={{ maxHeight: '70vh' }}
      />
    </div>
  );
}
