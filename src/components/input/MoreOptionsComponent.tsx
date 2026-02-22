import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdRadioButtonOn, IoMdRadioButtonOff } from "react-icons/io";

interface MoreOptionsComponentProps {
  options: { seperateLevel: 'word' | 'line' };
  setOptions: (options: { seperateLevel: 'word' | 'line' }) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

export default function MoreOptionsComponent({ options, setOptions, isOpen, setIsOpen, className }: MoreOptionsComponentProps) {
  return (
    <div className={`bg-gray-100 border-gray-400 hover:bg-gray-200 hover:border-gray-500 transition-all rounded-[2rem] border-[1px] py-[1.5rem] px-[2rem] ${className}`}>
      {isOpen && (
        <div className='' role="group" aria-label="More options">
          <div className='flex flex-row items-center justify-center cursor-pointer mb-[1rem]' onClick={() => setIsOpen(!isOpen)} role="button" aria-label="Collapse more options" aria-expanded="true" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}>
            <FaChevronDown className='text-[1.1rem] mr-[1rem]' aria-hidden />
            <p className='text-[1.3rem] font-bold'>More Options</p>
          </div>
          <div className='flex flex-col items-start text-[1rem]' role="radiogroup" aria-label="Separate text by">
            <div className='font-semibold text-[1.2rem] mb-[0.5rem]'>Seperate by:</div>
            
            <div className='flex flex-row items-center justify-start ml-[0.4rem] mb-[0.7rem]'>
              {options.seperateLevel === 'line'
                ? <IoMdRadioButtonOn className='text-[1rem] mr-[0.5rem]' aria-hidden />
                : <IoMdRadioButtonOff className='text-[1rem] mr-[0.5rem]' aria-hidden />}
              <button
                onClick={() => setOptions({ ...options, seperateLevel: 'line' })}
                className="flex items-center text-[1.1rem]"
                style={{ lineHeight: '1rem' }}
                aria-label="Separate by line"
                aria-pressed={options.seperateLevel === 'line'}
              >
                Line
              </button>
            </div>

            <div className='flex flex-row items-center justify-start ml-[0.4rem]'>
              {options.seperateLevel === 'word'
                ? <IoMdRadioButtonOn className='text-[1rem] mr-[0.5rem]' aria-hidden />
                : <IoMdRadioButtonOff className='text-[1rem] mr-[0.5rem]' aria-hidden />}
              <button
                onClick={() => setOptions({ ...options, seperateLevel: 'word' })}
                className="flex items-center text-[1.1rem]"
                style={{ lineHeight: '1rem' }}
                aria-label="Separate by word"
                aria-pressed={options.seperateLevel === 'word'}
              >
                Word
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className='flex flex-row items-center justify-center cursor-pointer' onClick={() => setIsOpen(!isOpen)} role="button" aria-label="Expand more options" aria-expanded="false" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen); } }}>
          <FaChevronUp className='text-[1.1rem] mr-[1rem]' aria-hidden />
          <p className='text-[1.3rem] font-semibold'>More Options</p>
        </div>
      )}
    </div>
  );
}