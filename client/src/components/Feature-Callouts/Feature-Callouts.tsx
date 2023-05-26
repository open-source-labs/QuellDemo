import React from 'react';
import heroGraphic from '/client/src/assets/images/graphics/QUELL-hero-graphic.svg';

export const FeatureCallouts = () => {

  return (
    <section id="Features-Callouts">
        <div className="grow relative pt-14">
          <div className="container bg-background flex flex-col px-6 py-8 mx-auto pt-20 border border-darkgrey rounded-lg space-y-0 md:flex-row lg:px-12">
            <div className="md:py-12">
              <div className="flex flex-row space-x-6 mb-6">
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col ml-6">    
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <h1 className="leading-snug text-2xl font-sans font-semibold text-lightblue mb-4 lg:text-3xl">New Feature 🔥</h1>
                        <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Context Visualizer</h1>
                        <p className="font-sans font-extralight text-white mb-6 lg:text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                        <button className="bg-transparent border border-lightblue text-lightblue font-sans py-3 px-6 rounded hover:bg-lightblue hover:text-white md:w-1/2 xl:text-xl">Learn more</button>
                      </div>
                    </div>
                  <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
                    <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-12"></div>
        <div className="grow relative pt-14">
          <div className="container bg-background flex flex-col px-6 py-8 mx-auto pt-20 border border-darkgrey rounded-lg space-y-0 md:flex-row lg:px-12">
            <div className="flex flex-col md:flex-row md:py-12 lg:ml-8 lg:pl-8">
              <div className="pt-4 md:self-start md:pt-6 lg:pt-0 mb-8">
                <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
              </div>
              </div>
              <div className='xl:w-12'></div>
                <div className="flex flex-col ml-6 md:ml-9 md:pt-6 lg:pl-12 lg:ml-12">    
                  <div className="flex flex-col mb-6 lg:w-3/4">
                    <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Get the Chrome Extension</h1>
                    <p className="font-sans font-extralight text-white mb-6 lg:text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                    <button className="bg-transparent border border-lightblue text-lightblue font-sans py-3 px-6 rounded hover:bg-lightblue hover:text-white md:w-1/2 xl:text-xl">Download Now</button>
                  </div>
                </div>
              </div>
            </div>
    </section>
  )
}



  