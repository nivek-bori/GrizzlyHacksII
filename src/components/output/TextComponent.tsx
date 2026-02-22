import { CloudVisionPostReturn } from "@/app/api/cloud_vision/route";

export default function TextComponent({ fullText }: { fullText: NonNullable<CloudVisionPostReturn['full_text']> | null }) {
  return (
    <div role="region" aria-label="Transcript">
      <p className='text-[1.5rem] font-bold mb-[0.4rem]'>Transcript:</p>
      { fullText && fullText.trim() !== '' && <p className='text-[1.2rem]'>{fullText}</p> }
      { (!fullText || fullText.trim() === '') && <p className='text-[1.2rem]'>No transcript found.</p> }
    </div>
  );
}