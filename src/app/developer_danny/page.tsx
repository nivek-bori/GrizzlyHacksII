'use client';

// localhost:3000/developer_danny

import React, { useState } from "react";


export default function DeveloperDannyPage() {
  return (
    <div>
      <section className="flex flex-col items-center justify-start">
        <h1 className="mt-4 text-3xl font-bold text-blue-800 font-roman">Name</h1>

        <p className="mt-2 text-base font-normal text-gray-500">
          Just upload a PNG, and we will return all text from the PNG formatted in dyslexic-friendly fonts!</p>

        <div className="flex mt-4 space-x-8">
          <img src="/Tire Image.jpg" alt="Original PNG Submitted" className="w-64 h-64 object-cover" />
          <img src="/Tire Image.jpg" alt="Formatted PNG with Dyslexic-Friendly Font" className="w-64 h-64 object-cover" />
        </div>
        <p className="mt-4 text-sm text-gray-800">Original PNG Submitted (Left) vs. Formatted PNG with Dyslexic-Friendly Font (Right)</p>
        <button className="mt-16 text-lg bg-yellow-500 text-blue-800 border-gray-500 rounded-2xl p-4 shadow-lg hover:bg-yellow-600 focus:ring-2">Try Now!</button>
      </section>
      <section className="flex flex-col bg-gray-200 rounded-lg p-8 mt-16 hover:bg-gray-300">
        <ul className="list-disc pl-12 space-y-8 text-blue-800">
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
      <section className="flex flex-col pl-18 mt-12">
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> Trusted by 4 developers</h3>
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> 100% Satisfaction Rate</h3>
          <h3 className="text-lg font-semibold text-blue-800 mt-2"> 100% Free to Use</h3>
        </div>
      </section>
      <section className="flex flex-col pl-18 mt-12 bg-gray-300 rounded-lg p-8">
        <div>
          <h4 className="text-sm font-normal text-blue-800 mt-2">Helping Others since 2026</h4>
          <h4 className="text-sm font-normal text-blue-800 mt-2">Fully Open Source</h4>
        </div>
      </section>
    </div>
    
  );
}
