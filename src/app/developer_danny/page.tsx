'use client';

// localhost:3000/developer_danny

import React, { useState } from "react";

export default function DeveloperDannyPage() {
  return (
    <div>
      <section className="flex flex-col items-center justify-start">
        <h1 className="mt-4 text-3xl font-bold text-blue-800">UnJumblr</h1>
        <line className="w-4/5 h-0.5 bg-blue-800 mt-2 rounded-sm"></line>
      </section>
      <section className="flex flex-col items-center justify-center bg-gray-200 rounded-lg p-8 mt-16 w-4/5 mx-auto">
        <h1 className="mt-4 text-2xl font-bold text-blue-800">What Is UnJumblr?</h1>
        <p className="mt-4 text-lg font-normal text-blue-800">
          UnJumblr is a tool that takes PNGs, pulls out the text included in the PNGs, formats the text to dyslexic-friendly fonts,
          and then outputs the formatted text as a new PNG. By doing this, our system helps with clarity and readability for individuals with dyslexia.</p>
      </section>
      <section className="mt-16">
        <div className="flex mx-auto justify-center gap-12">
          <img 
          src="/handwritten-text-1.png" 
          alt="Original PNG Submitted" 
          className="w-240 h-96 rounded-xl shadow-lg" />
          <p className="text-lg text-blue-800 bg-gray-200 rounded-xl p-8 max-w-md">
            The file is uploaded and analyzed. The original file contains text that is hard to read for people with dyslexia.</p>
        </div>
      </section>
      <section className="mt-16">
        <div className="flex mx-auto justify-center gap-12">
          <img 
          src="/Tire Image.jpg" 
          alt="Formatted PNG Output" 
          className="w-240 h-96 rounded-xl shadow-lg" />
          <p className="text-lg text-blue-800 bg-gray-200 rounded-xl p-8 max-w-md">
            The file is formatted with the new font. The result is a formatted version of the original with font that is easier to read for people with dyslexia.</p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center mt-16 space-y-8">
        <button className="mt-4 text-5xl bg-yellow-500 text-blue-800 border-gray-500 rounded-4xl p-12 shadow-lg hover:bg-yellow-600 focus:ring-2 cursor-pointer">Try Now!</button>
        <h1 className="text-2xl text-blue-800 mt-4 font-bold">More Examples</h1>
        <line className="w-4/5 h-0.5 bg-blue-800 mt-2 rounded-sm"></line>
        <img
          src="/handwritten-text-2.png"
          alt="Example of UnJumblr's Output"
          className="w-200 h-96 rounded-xl shadow-lg"
        />
        <img 
          src="/Tire Image.jpg" 
          alt="Formatted PNG Output" 
          className="w-240 h-96 rounded-xl shadow-lg" />
        <line className="w-4/5 h-0.5 bg-blue-800 mt-2 rounded-sm"></line>
        <img
          src="/handwritten-text-3.png"
          alt="Example of UnJumblr's Output"
          className="w-240 h-96 rounded-xl shadow-lg"
        />
        <img 
          src="/Tire Image.jpg" 
          alt="Formatted PNG Output" 
          className="w-240 h-96 rounded-xl shadow-lg" />
        <line className="w-4/5 h-0.5 bg-blue-800 mt-2 rounded-sm"></line>
        <img
          src="/handwritten-text-4.png"
          alt="Example of UnJumblr's Output"
          className="w-240 h-96 rounded-xl shadow-lg"
        />
        <img 
          src="/Tire Image.jpg" 
          alt="Formatted PNG Output" 
          className="w-240 h-96 rounded-xl shadow-lg" />
        <line className="w-4/5 h-0.5 bg-blue-800 mt-2 rounded-sm"></line>
      </section>
      <section className="flex flex-col bg-gray-200 rounded-lg p-8 mt-16">
        <ul className="list-disc pl-40 space-y-8 text-blue-800">
          <li>
            <h3 className="text-xl font-semibold text-blue-800 mt-2">Quick Processing</h3>
            <p className="text-gray-500 font-normal mt-2">Rapid processing of PNGs for efficient performance</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-800 mt-2">Accurate Results</h3>
            <p className="text-gray-500 font-normal mt-2">Formatting of text is done accurately </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-800 mt-2">Big Impact</h3>
            <p className="text-gray-500 font-normal mt-2">By formattng PNGs into dyslexic-friendly fonts, our system helps with clarity</p>
          </li>
        </ul>
      </section>
      <section className="flex flex-row mt-12 space-x-20 mx-auto justify-center">
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> Trusted by 4 developers</h3>
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> 100% Satisfaction Rate</h3>
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> 100% Free to Use</h3>
      </section>
      <section className="flex flex-col pl-18 mt-12 bg-gray-300 rounded-lg p-8 justify-end pl-40">
        <div>
          <h4 className="text-sm font-normal text-blue-800 mt-2">Helping Others since 2026</h4>
          <h4 className="text-sm font-normal text-blue-800 mt-2">UnJumblr © 2026</h4>
        </div>
      </section>
    </div>
    
  );
}
