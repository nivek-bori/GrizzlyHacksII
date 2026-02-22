import { NavBarSelection } from "../OutputComponent";

function NavBarButton({ displayName, onClick, isActive, className }: { displayName: string, onClick: () => void, isActive: boolean, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`${className} flex`}
    >
      <span className="inline-flex flex-col items-center">
        <p className='text-[1.6rem] font-semibold px-[3px] pb-[3px]' style={{ lineHeight: '1'}}>{displayName}</p>
        <span className={`block bg-current rounded h-[3px] w-full ${isActive ? 'opacity-100' : 'opacity-0'} transition-all duration-200`} style={{ width: '100%', height: '3px' }}></span>
      </span>
    </button>
  )
}

export default function NavBarComponent({ navBarSelection, setNavBarSelection, className }: { navBarSelection: NavBarSelection, setNavBarSelection: (selection: NavBarSelection) => void, className?: string }) {
  return (
    <nav className={`w-full flex flex-row items-center justify-between px-[4rem] font-semibold ${className}`}>
      <NavBarButton displayName='Home' onClick={() => setNavBarSelection('home')} isActive={navBarSelection === 'home'} className={'text-purple-600'} />
      <NavBarButton displayName='Image' onClick={() => setNavBarSelection('image')} isActive={navBarSelection === 'image'} className={'text-green-600'} />
    </nav>
  );
}