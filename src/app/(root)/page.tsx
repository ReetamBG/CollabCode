import React from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams';

const page = () => {
  return (
    <>
      <BackgroundBeams />
      <div className="h-dvh w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <div className="p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            <span className="text-primary">CollabCode</span>
            <br />
            <span className="text-3xl md:text-6xl">Collaboratively code with anyone</span>
          </h1>
          <p className="mt-8 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Write code together in real-time.  
            Collaborate with teammates, mentor students, or hack with friends - all without leaving your browser.
          </p>
        </div>
      </div>
    </>
  );
}


export default page