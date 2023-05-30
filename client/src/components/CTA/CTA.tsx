import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import clipboardGraphic from '/client/src/assets/images/graphics/clipboard.svg';

export const CTA = () => {
  const [buttonTextClient, setButtonTextClient] = useState('npm install @quell/client');
  const [buttonTextServer, setButtonTextServer] = useState('npm install @quell/server');
  const [isServerButtonDisabled, setIsServerButtonDisabled] = useState(false);

  const buttonClientRef = useRef(null);
  const buttonServerRef = useRef(null);

  const handleClientButtonClick = () => {
    navigator.clipboard
      .writeText(buttonTextClient)
      .then(() => {
        setButtonTextClient('Copied!');
        setTimeout(() => {
          setButtonTextClient('npm install @quell/client');
        }, 2000);
      })
      .catch((error) => {
        console.log('Failed to copy text:', error);
      });
  };

  const debouncedServerButtonClick = debounce(() => {
    if (isServerButtonDisabled) {
      return;
    }

    setIsServerButtonDisabled(true);

    navigator.clipboard
      .writeText(buttonTextServer)
      .then(() => {
        setButtonTextServer('Copied!');
        setTimeout(() => {
          setButtonTextServer('npm install @quell/server');
          setIsServerButtonDisabled(false);
        }, 2000);
      })
      .catch((error) => {
        console.log('Failed to copy text:', error);
        setIsServerButtonDisabled(false);
      });
  }, 200);

  useEffect(() => {
    return () => {
      debouncedServerButtonClick.cancel();
    };
  }, []);

  return (
    <section id="CTA">
      <div className="grow relative py-24 md:py-24 lg:py-36">
        <div className="container bg-background flex flex-col mx-auto px-6 py-8 space-y-0 lg:flex-row lg:justify-around xl:px-8">
          <div className="flex flex-col mb-3 lg:w-2/3">
            <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl">Query without worry</h1>
            <p className="font-sans font-extralight text-white mb-6 lg:text-xl xl:w-3/4">Let Quell take care of your GraphQL queries while you focus on building an incredible app for your users. Get started by installing Quell now.</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-md text-white font-sans font-light">To install and save in your package.json dependencies, run the command below using npm:</p>
            <div
              ref={buttonClientRef}
              className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8"
              onClick={handleClientButtonClick}
            >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">
                {buttonTextClient}
              </div>
              <img className="w-5 h-auto" src={clipboardGraphic} alt="Clipboard Graphic" />
            </div>
            <button
              ref={buttonServerRef}
              className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8"
              onClick={debouncedServerButtonClick}
              disabled={isServerButtonDisabled}
            >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">
                {buttonTextServer}
              </div>
              <img className="w-5 h-auto self-center" src={clipboardGraphic} alt="Clipboard Graphic" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
