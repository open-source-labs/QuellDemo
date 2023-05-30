import React from 'react';
import heroGraphic from '/client/src/assets/images/graphics/QUELL-hero-graphic.svg';
import contextVisualizer from '/client/src/assets/images/graphics/context-visualizer.svg'
import extension from '/client/src/assets/images/graphics/extension.svg'
import contextVisualizerTransparent from'/client/src/assets/images/graphics/visualizer-transparent.svg'
import extensionTransparent from '/client/src/assets/images/graphics/extension-transparent.svg';


export const FeatureCallouts = () => {

  return (
    <section id="Features-Callouts">
        <div className="grow relative pt-14">
          <div className="container bg-background flex flex-col px-6 py-8 mx-auto pt-20 border border-darkgrey rounded-lg space-y-0 md:flex-row lg:px-12">
            <div className="md:py-12">
              <div className="flex flex-row space-x-6 mb-6">
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col ml-6 md:w-3/4 xl:w-1/2">    
                      <div className="flex flex-col mb-3">
                        <h1 className="leading-snug text-2xl font-sans font-semibold text-lightblue mb-4 lg:text-3xl">New Feature 🔥</h1>
                        <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Context Visualizer</h1>
                        <p className="font-sans font-extralight text-white mb-6 lg:text-xl">Use Quell's new context visualizer to better understand the relationship between a query and its GraphQL structure, view response speeds on each field, and get data for more effective debugging.</p>
                        <button className="bg-transparent border border-lightblue text-lightblue font-sans py-3 px-6 rounded hover:bg-lightblue hover:text-white md:w-1/2 xl:text-xl">Learn more</button>
                      </div>
                    </div>
                  <div className="pt-4 md:self-start md:pt-6 lg:pt-0 xl:pl-12 xl:ml-12">
                    <img className="w-full h-auto xl:w-auto xl:h-full rounded-lg" src={contextVisualizerTransparent} alt="Context Visualizer"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-12"></div>
        <div className="grow relative pt-14">
          <div className="container bg-background flex flex-col px-6 py-8 mx-auto pt-20 border border-darkgrey rounded-lg space-y-0 md:flex-row lg:px-12 xl:py-32">
            <div className="flex flex-col md:flex-row py-0 md:py-12 xl:ml-8 xl:pl-8">
              <div className="pt-4 md:self-start md:pt-6 lg:pt-0 mb-8">
                <img className="w-full h-auto lg:w-auto lg:h-full rounded-lg" src={extensionTransparent} alt="Chrome Extension"/>
              </div>
              </div>
              <div className='xl:w-12'></div>
                <div className="flex flex-col ml-6 md:ml-9 md:pt-6 lg:pl-12 lg:ml-12">    
                  <div className="flex flex-col mb-6 xl:w-3/4">
                    <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Get the Chrome Extension</h1>
                    <p className="font-sans font-extralight text-white mb-6 lg:text-xl">Download the Quell Chrome Extension to get real-time feedback on your GraphQL app and access all the developer tools that Quell has to offer.</p>
                    <button className="bg-transparent border border-lightblue text-lightblue font-sans py-3 px-6 rounded hover:bg-lightblue hover:text-white md:w-1/2 xl:text-xl">Download Now</button>
                  </div>
                </div>
              </div>
            </div>
    </section>
  )
}



  