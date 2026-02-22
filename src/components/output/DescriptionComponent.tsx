export default function DescriptionComponent() {
  return (
    <div className='gap-[0.7rem] flex flex-col items-center justify-center'>
      <h1 className='text-[2.3rem] font-bold text-center mt-[0.5rem] mb-[0.8rem]'>Welcome to UnJumblr!</h1>
      <p className='text-[1.3rem] text-left'><b>Unjumblr</b> is a tool that makes <b> any font </b>you see <b> easier to read</b>.</p>
      <p className='text-[1.3rem] text-left'><b>Unjumblr</b> works by <b>changing the font</b> in your images to <b>OpenDyslexic</b>, making it easier toread.</p>

      <div className='flex flex-col items-center justify-evenly my-[1.2rem] bg-gray-300 rounded-[1.5rem] w-full py-[1.3rem]'>
        <p className='text-[1.8rem] font-semibold mb-[0.8rem]'>Did you know?</p>
        <p className='text-[2.1rem] text-gray-800 font-semibold mb-[0.4rem]' style={{lineHeight: '1'}}>5% to 10%</p>
        <p className='text-[1.6rem] mb-[0.1rem]'>of people have dyslexia</p>
      </div>

      <p className='text-[1.3rem]'>People with dyslexia struggle to read restaurant menus, signs, and more. This disability frequently inhibits their daily lives.</p>
      <p className='text-[1.3rem]'>Umjumblr addresses this issue by replacing the all the text in your images with <b>OpenDyslexic</b>, making it easier to read.</p>

      <p className='text-[1.4rem] font-semibold text-center mt-[1.2rem]'>Try it out now! Upload your image below to see how Umjumblr can help.</p>
    </div>
  );
}