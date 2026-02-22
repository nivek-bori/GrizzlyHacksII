'use client'

// Output Component
// params: setImageStatus, canvasRef, rawTextData
// conditions: imageStatus  is not 'none' → display
// if imageStatus is 'loading' → display loading
// if imageStatus is 'new' → display image & text
// if imageStatus is 'processing' → display loading
// if imageStatus is 'success' → display image & text
// if imageStatus is 'error' → display error

import React, { useState } from "react";
import NavBarComponent from "./output/NavBarComponent";
import { ImageStatus } from "./HomeComponent";
import DescriptionComponent from "./output/DescriptionComponent";
import ImageComponent from "./output/ImageComponent";
import TextComponent from "./output/TextComponent";
import { CloudVisionPostReturn } from "@/app/api/cloud_vision/route";

interface OutputComponentProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageStatus: ImageStatus;
  imageData: { file: File, base64: string, canvasData: { aspect: number, width: number, height: number } } | null;
  fullText: NonNullable<CloudVisionPostReturn['full_text']> | null;
  navBarSelection: NavBarSelection;
  setNavBarSelection: (selection: NavBarSelection) => void;
  className?: string;
}

export type NavBarSelection = 'home' | 'image';

export default function OutputComponent({ canvasRef, imageStatus, imageData, fullText, navBarSelection, setNavBarSelection, className }: OutputComponentProps) {
  const handleSetNavBarSelection = (selection: NavBarSelection) => {
    if (selection !== 'home' && imageStatus === 'none') {
      alert('Upload an image to get started');
      return;
    }
    
    setNavBarSelection(selection);
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ overflowY: 'auto', height: '100%' }}>
      <div className='px-[4rem] py-[5rem] w-full flex-1'>
        <NavBarComponent navBarSelection={navBarSelection} setNavBarSelection={handleSetNavBarSelection} className='mb-[3rem]' />

        <div className="relative w-full h-full">
          {/* Always render all components, hide/show via CSS for stacking/overlay */}
          <div style={{ zIndex: navBarSelection === 'home' ? 2 : 1, position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: navBarSelection === 'home' ? "auto" : "none", opacity: navBarSelection === 'home' ? 1 : 0, transition: "opacity 0.15s" }}>
            <DescriptionComponent />
          </div>
          <div style={{ zIndex: navBarSelection === 'image' ? 2 : 1, position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: navBarSelection === 'image' ? "auto" : "none", opacity: navBarSelection === 'image' ? 1 : 0, transition: "opacity 0.15s" }}>
            <ImageComponent imageStatus={imageStatus} canvasRef={canvasRef} aspect={imageData?.canvasData?.aspect ?? 1} className="mb-[4.1rem]" />
            <TextComponent fullText={fullText} />
          </div>
        </div>
      </div>
    </div>
  );
}