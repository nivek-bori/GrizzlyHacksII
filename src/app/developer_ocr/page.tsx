'use client';

import { request } from '@/lib/api';
import { useRef } from 'react';
import { OCRPostReturn } from '../api/tesseract/route';
import { CloudVisionPostReturn } from '../api/cloud_vision/route';

export default function DeveloperPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImageData = (imageData: string, textData: NonNullable<OCRPostReturn['text_data']> | NonNullable<CloudVisionPostReturn['text_data']>) => {
    if (!imageData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      
      ctx.save();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = Math.max(2, img.width * 0.005);
      
      ctx.beginPath();
      for (const text of textData) {
        // Cloud Vision
        if ('x2' in text.bounding_box && 'y2' in text.bounding_box && 'x3' in text.bounding_box && 'y3' in text.bounding_box) {
          const { x0, y0, x1, y1, x2, y2, x3, y3 } = text.bounding_box;
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
        }
        // Tesseract
        else {
          const { x0, y0, x1, y1 } = text.bounding_box;
          const width = x1 - x0;
          const height = y1 - y0;
  
          ctx.rect(x0, y0, width, height);

        }
      }
      ctx.closePath();
      
      ctx.stroke();
      ctx.restore();
    };
    img.src = imageData;
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
      try {
        // OCR
        const formData = new FormData();
        formData.append('image', binaryImage);
        // const res = await request<OCRPostReturn>({ type: 'POST', route: '/api/tesseract', body: formData });
        const res = await request<CloudVisionPostReturn>({ type: 'POST', route: '/api/cloud_vision', body: formData });
        console.log(`development:`, res.status, res.message, res.text_data); // TODO: REMOVE
        
        // Draw Image
        const base64Image = reader.result as string;
        if (res.status === 'success' && res.text_data) drawImageData(base64Image, res.text_data);
      } catch (e: any) {
        alert('Upload failed');
      }
    };
    reader.readAsDataURL(binaryImage);
  }

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