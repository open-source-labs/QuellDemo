import React from 'react';
import { useState, useEffect } from 'react';
import lightningIcon from '/client/src/assets/images/graphics/lightning.svg';
import heroGraphic from '/client/src/assets/images/graphics/QUELL-hero-graphic.svg';

export const Features: React.FC = () => {

// Set initial state to Text 1
const [ selectedFeature, setSelectedFeature] = useState<string>('Text 1')

// Function to toggle between different features
const toggleFeature = (text: string) => {
    setSelectedFeature(text)
}

  return (
    <section id="Features">
        <div className="grow relative pt-14">
          <div className="container bg-darkblue flex flex-col px-6 py-8 mx-auto pt-10 rounded-lg content-start space-y-0">
            <div className="flex flex-col lg:pl-8">
            <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4">
              Lorem ipsum dolor sit amet
            </h1>
            <div className="flex flex-row space-x-6 mb-4">
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 1' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 1')}>
              Fast & Accurate Caching
            </p>
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 2' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 2')}>
              Easy Installation
            </p>
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 3' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 3')}>
              Built-in Security
            </p>
            </div>
              {selectedFeature === 'Text 1' && (
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                </div>
                <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
               <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
             </div>
                </div>
              )}
              {selectedFeature === 'Text 2' && (
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                </div>
                <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
               <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
             </div>
                </div>
              )}
              {selectedFeature === 'Text 3' && (
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Lorem ipsum dolor sit amet</p>
                        <p className="font-sans font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                     </div>
                </div>
                </div>
                <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
               <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
             </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </section>
  )
}



  