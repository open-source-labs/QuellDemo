import React, { useState, useEffect, useRef } from 'react';
import heroGraphic from '/client/src/assets/images/graphics/QUELL-hero-graphic.svg';
import clipboardGraphic from '/client/src/assets/images/graphics/clipboard.svg';


export const Hero = () => {

  // Store button text
  const [buttonText, setButtonText] = useState('npm install @quell/client');

  // Reference button element
  const buttonRef = useRef(null)

  // Function to copy text to clipboard on button click
  const handleButtonClick = () => {
    navigator.clipboard.writeText(buttonText)
      .then(() => {
        setButtonText('Copied!');
        setTimeout(() => {
          setButtonText('npm install @quell/client')
        }, 2000);
      })
      .catch((error: string) => {
        console.log('Failed to copy text:', error);
      });
  };

  useEffect(() => {
    if (buttonText === 'Copied!') {
      const timeoutId = setTimeout(() => {
        setButtonText('npm install @quell/client');
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [buttonText]);


  return (
    <section id="hero">
      <div className="grow relative pt-6 md:pt-14">
      <div className="container bg-background flex flex-col items-center px-6 mx-auto pt-10 content-start space-y-0 md:flex-row md:space-y-0 md:gap-12 xl:justify-between">
        <div className="flex flex-col mb-16 md:mb-32 space-y-12 md:w-1/2 md:space-y-8">
          <h1 className="leading-snug text-4xl font-sans font-semibold text-white md:text-2xl md:leading-snug lg:text-4xl lg:leading-snug xl:text-5xl xl:leading-snug xl:w-full">
            The lightweight caching solution for GraphQL developers
          </h1>
          <div className="flex flex-col justify-center gap-4 xl:gap-12 xl:justify-start xl:flex-row">
            <button onClick={() => document.getElementById('Demo-Header')?.scrollIntoView()} className="bg-lightblue text-white font-sans py-3 px-14 rounded hover:bg-altblue md:text-base xl:text-xl">Try Demo</button>
            <div ref={buttonRef} key={buttonText} className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8" onClick={handleButtonClick} >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">{buttonText}</div>
              <img className="w-5 h-auto"src={clipboardGraphic} alt="Clipboard Graphic"/>
            </div>
          </div>
        </div>
        <div className="md:self-start xl:pr-16">
          <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
        </div>
      </div>
      </div>
    </section>
  );
};


