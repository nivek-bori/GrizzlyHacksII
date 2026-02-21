'use client';

import { request } from '@/lib/api';
import { useRef } from 'react';
import { OCRPostReturn } from '../api/ocr/route';

export default function DeveloperPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImageData = (imageData: string) => {
    if (!imageData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
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
      const base64Image = reader.result as string;
      try {
        // OCR
        const formData = new FormData();
        formData.append('image', binaryImage);
        const res = await request<OCRPostReturn>({ type: 'POST', route: '/api/ocr', body: formData });
        console.log(`development: ${res.status} ${res.message} ${res.text_data}`);
        
        // Draw Image
        drawImageData(base64Image);
      } catch (e: any) {
        alert('Upload failed');  // TODO: NOTIFICAT
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