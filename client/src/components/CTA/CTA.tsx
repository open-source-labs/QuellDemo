import React, {useState, useRef, useEffect} from 'react';
import clipboardGraphic from '/client/src/assets/images/graphics/clipboard.svg';

export const CTA = () => {

  // Store button text
  const [buttonTextClient, setButtonTextClient] = useState('npm install @quell/client');
  const [buttonTextServer, setButtonTextServer] = useState('npm install @quell/server');

  // Reference button element
  const buttonClientRef = useRef(null);
  const buttonServerRef = useRef(null);

  // Function to copy text to clipboard on button click for client
  const handleClientButtonClick = () => {
    navigator.clipboard.writeText(buttonTextClient)
      .then(() => {
        setButtonTextClient('Copied!');
        setTimeout(() => {
          setButtonTextClient('npm install @quell/client')
        }, 2000);
      })
      .catch((error) => {
        console.log('Failed to copy text:', error);
      });
  };

    // Function to copy text to clipboard on button click for server
    const handleServerButtonClick = () => {
      navigator.clipboard.writeText(buttonTextServer)
        .then(() => {
          setButtonTextServer('Copied!');
          setTimeout(() => {
            setButtonTextServer('npm install @quell/server')
          }, 2000);
        })
        .catch((error) => {
          console.log('Failed to copy text:', error);
        });
    };

  useEffect(() => {
    if (buttonTextClient === 'Copied!') {
      const timeoutId = setTimeout(() => {
        setButtonTextClient('npm install @quell/client');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [buttonTextClient]);


  useEffect(() => {
    if (buttonTextServer === 'Copied!') {
      const timeoutId = setTimeout(() => {
        setButtonTextServer('npm install @quell/server');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [buttonTextServer]);


  return (
  <section id="CTA">
  <div className="grow relative py-24 md:py-24 lg:py-36">
    <div className="container bg-background flex flex-col mx-auto px-6 py-8 space-y-0 lg:flex-row lg:justify-around xl:px-8">
      <div className="flex flex-col mb-3 lg:w-2/3">
          <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Query without worry</h1>
          <p className="font-sans font-extralight text-white mb-6 lg:text-xl xl:w-3/4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>
        <div className="flex flex-col gap-4">
        <p className="text-md text-white font-sans font-light">To install and save in your package.json dependencies, run the command below using npm:</p>
        <div ref={buttonClientRef} key={buttonTextClient} className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8" onClick={handleClientButtonClick} >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">{buttonTextClient}</div>
              <img className="w-5 h-auto"src={clipboardGraphic} alt="Clipboard Graphic"/>
        </div>
        <div ref={buttonServerRef} key={buttonTextServer} className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8" onClick={handleServerButtonClick} >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">{buttonTextServer}</div>
              <img className="w-5 h-auto"src={clipboardGraphic} alt="Clipboard Graphic"/>
        </div>
        </div>
      </div>
  </div>
</section>
)
};





