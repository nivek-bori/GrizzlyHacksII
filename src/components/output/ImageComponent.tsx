import { ImageStatus } from "../HomeComponent";

export default function ImageComponent({ imageStatus, canvasRef, aspect, className }: { imageStatus: ImageStatus, canvasRef: React.RefObject<HTMLCanvasElement | null>, aspect: number, className?: string }) {
  return (
    <div className={`max-h-[70vh] ${className}`}>
      <p className='text-[1.5rem] font-bold mb-[1.6rem]'>Image:</p>

      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          className="relative w-full border border-gray-300 rounded shadow-sm"
          style={aspect ? { aspectRatio: `${aspect}` } : undefined}
        />

        {imageStatus === 'none' && (
          <div className="absolute inset-0 flex items-center justify-center text-[1.3rem]">
            Upload an image to get started
          </div>
        )}

        {imageStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[1.3rem]">
            Loading...
          </div>
        )}

        {imageStatus === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[1.3rem]">
            Processing...
          </div>
        )}

        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[1.3rem]">
            Issue processing image.
            Please try again.
          </div>
        )}
      </div>
    </div>
  );
}