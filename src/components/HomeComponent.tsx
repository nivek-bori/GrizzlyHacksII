'use client';

import { CloudVisionPostReturn } from '@/app/api/cloud_vision/route';
import { request } from '@/lib/api';
import { drawImageData } from '@/lib/drawing';
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
        formData.append('seperate_level', 'line'); // TODO: USER INPUT
        const res = await request<OCRPostReturn>({ type: 'POST', route: '/api/cloud_vision', body: formData });
        console.log(`development:`, res.status, res.message, res.text_data);

        // Draw Image
        drawImageData(canvasRef.current, base64Image, res.text_data ?? []);
      } catch (e: any) {
        drawImageData(canvasRef.current, base64Image, []);
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
