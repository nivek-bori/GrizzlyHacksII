'use client'

// Input File Component
// params: handleUpload, handleSubmit,setImageStatus, options, setOptions
// submit button → handleSubmit
// upload → handleUpload, setImageStatus('new')
// change options → setOptions

import { useState } from "react";
import { ImageStatus } from "../HomeComponent";
import { FaCamera } from "react-icons/fa";
import MoreOptionsComponent from "./MoreOptionsComponent";

interface InputComponentProps {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: () => void;
  options: { seperateLevel: 'word' | 'line' };
  setOptions: (options: { seperateLevel: 'word' | 'line' }) => void;
  className?: string
}

export default function InputComponent({ handleUpload, handleSubmit, options, setOptions, className }: InputComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center py-[4rem] pb-[5rem] px-[5rem] ${className}`}>
      <div className='w-full h-full flex flex-col max-w-[600px] gap-[1.2rem]'>
        <header>
          <h1 className='font-bold text-[2.5rem] w-full mb-[0.3rem]'>Unjumblr</h1>
          <p className='text-[0.85rem] w-full' style={{ lineHeight: '1' }}>Project by KDAA <span className='text-[0.9rem]'>🛞</span></p>
          <p className='mb-[1.6rem] text-[0.85rem] w-full'>Made for Grizzly Hacks II</p>
        </header>
        <input
          id="image-upload"
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          required
          onChange={handleUpload}
          aria-label="Upload an image"
        />
        <label htmlFor="image-upload" className='flex flex-col gap-[0.9rem] items-center justify-center flex-7 bg-blue-100 border-blue-300 hover:border-blue-400 transition-all border-[2px] rounded-[2rem]' aria-label="Upload an image">
          <FaCamera className='text-[4rem]' />
          <div className='text-[1.6rem] font-semibold'>upload an image</div>
        </label>

        <MoreOptionsComponent options={options} setOptions={setOptions} isOpen={isOpen} setIsOpen={setIsOpen} className=''></MoreOptionsComponent>
        
        <button onClick={handleSubmit} className='flex items-center justify-center p-[1.5rem] bg-green-400 hover:bg-green-500 border-green-500 hover:border-green-600 transition-all border-[2px] rounded-[2rem]' aria-label="Submit image for processing">
          <p className='text-[1.6rem] font-bold'>Submit</p>
        </button>
      </div>
    </div>
  );
}