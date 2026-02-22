'use client';

import { CloudVisionPostReturn } from '@/app/api/cloud_vision/route';
import { OCRPostReturn } from '@/app/api/tesseract/route';
import { request } from '@/lib/api';
import { drawImageData } from '@/lib/drawing';
import { CloudVisionTextDetection } from '@/types/types';
import { useRef, useState } from 'react';
import InputComponent from './input/InputComponent';
import OutputComponent, { NavBarSelection } from './OutputComponent';

export type ImageStatus = 'none' | 'loading' | 'new' | 'processing' | 'success' | 'error';

export default function HomeComponent() {
  // Input File Component
  const [imageData, setImageData] = useState<{ file: File, base64: string, canvasData: { aspect: number, width: number, height: number }} | null>(null);
  const [options, setOptions] = useState<{ seperateLevel: 'word' | 'line'; }>({ seperateLevel: 'line' });

  // Output Component
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fullText, setFullText] = useState<NonNullable<CloudVisionPostReturn['full_text']> | null>(null);
  const [navBarSelection, setNavBarSelection] = useState<NavBarSelection>('home');

  // Website Description & Input & Output Component
  const [imageStatus, setImageStatus] = useState<ImageStatus>('none');

  // save file, base64, draw basic image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const imageFiles = e.target as HTMLInputElement;
    if (!imageFiles.files || imageFiles.files.length === 0) {
      alert('No file uploaded.');
      return;
    }

    setImageStatus('loading');

    const imageFile = imageFiles.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const img = new Image();
      img.onload = () => {
        const canvasData = { aspect: img.naturalWidth / img.naturalHeight, width: img.naturalWidth, height: img.naturalHeight };
        setImageData({ file: imageFile, base64: base64Image, canvasData });
        drawImageData(canvasRef.current, canvasData, base64Image, null);
        setFullText(null);
        setImageStatus('new');
        setNavBarSelection('image');
      }
      img.onerror = () => {
        setImageStatus('error');
      }
      img.src = base64Image;
    };
    reader.readAsDataURL(imageFile);

    e.target.value = "";
  }

  // process image, save ocr results
  const handleSubmit = async () => {
    if (!imageData) {
      alert('Please select an image before submitting.');
      return;
    }

    setImageStatus('processing');

    const formData = new FormData();
    formData.append('image', imageData.file);
    formData.append('seperate_level', options.seperateLevel);
    const res = await request<CloudVisionPostReturn>({ type: 'POST', route: '/api/cloud_vision', body: formData });
    console.log(`development:`, res.status, res.message, res.text_data); // TODO: REMOVE

    if (res.status === 'success' && canvasRef.current) {
      drawImageData(canvasRef.current, imageData.canvasData, imageData.base64, res.text_data ?? null);
      setFullText(res.full_text ?? null);
    }
    
    setImageStatus(res.status);
  };

  return (
    <div className="w-full h-full flex">
      <div className="flex flex-1 h-full">
        <div className="flex-1 h-full flex">
          <InputComponent 
            handleUpload={handleUpload}
            handleSubmit={handleSubmit}
            options={options}
            setOptions={setOptions}
            className="w-full h-full"
          />
        </div>
        <div className="flex-[1.5] h-full bg-gray-200">
          <OutputComponent imageStatus={imageStatus} canvasRef={canvasRef} imageData={imageData} fullText={fullText} navBarSelection={navBarSelection} setNavBarSelection={setNavBarSelection} className="w-full min-h-full"></OutputComponent>
        </div>
      </div>
    </div>
  );
}
