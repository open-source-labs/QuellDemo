import React from 'react';
import { useState, useEffect } from 'react';
import lightningIcon from '/client/src/assets/images/graphics/lightning.svg';
import cacheGraphic from '/client/src/assets/images/graphics/cache-graphic.svg';
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
            <div className="flex flex-col lg:pl-8 pt-6">
            <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4">
            A Javascript library to simplify GraphQL caching
            </h1>
            <div className="flex flex-row space-x-6 mb-6">
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 1' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 1')}>
              Fast & Accurate Caching
            </p>
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 2' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 2')}>
              Easy Onboarding
            </p>
            <p className={`font-sans cursor-pointer text-white font-semibold hover:underline underline-offset-8 decoration-lightblue ${selectedFeature === 'Text 3' ? 'underline' : ''}`} onClick={() => toggleFeature('Text 3')}>
              Built-in Security
            </p>
            </div>
              {selectedFeature === 'Text 1' && (
                <div className="flex flex-col md:flex-row pb-6">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Lightning-fast Caching</p>
                        <p className="font-sans font-extralight text-white">Cache both client-side and server-side GraphQL queries with speed and simplicity.</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Enhanced Query Efficiency</p>
                        <p className="font-sans font-extralight text-white">Make precise queries to retrieve your data with reduced cache misses.</p>
                     </div>
                </div>
                <div className="flex flex-row">
                <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Robust Caching Strategies</p>
                        <p className="font-sans font-extralight text-white">Quell's cache invalidation and normalization strategies means your app will always stay fast, without any bloat.</p>
                     </div>
                </div>
                </div>
                <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
               <img className="w-full h-auto xl:w-auto xl:h-full" src={cacheGraphic} alt="Cache Graphic"/>
             </div>
                </div>
              )}
              {selectedFeature === 'Text 2' && (
                <div className="flex flex-col md:flex-row pb-6">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Simple Installation</p>
                        <p className="font-sans font-extralight text-white">Install our client or server-side npm package for easy and quick integratoin into your existing GraphQL projects.</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Detailed Documentation</p>
                        <p className="font-sans font-extralight text-white">Get a comprehensive guide for seamless implementation and tutorials on maximizing caching benefits.</p>
                     </div>
                </div>
                <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Chrome Extension</p>
                        <p className="font-sans font-extralight text-white">Download our Chrome extension to get additional developor tools for better debugging and analysis on your queries.</p>
                     </div>
                </div>
                </div>
                <div className="pt-4 md:self-start md:pt-6 lg:pt-0">
               <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
             </div>
                </div>
              )}
              {selectedFeature === 'Text 3' && (
                <div className="flex flex-col md:flex-row pb-6">
                  <div className="flex flex-col">    
                    <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Security Middleware</p>
                        <p className="font-sans font-extralight text-white">Easily integrate Quell's built-in security middleware into your GraphQL server.</p>
                      </div>
                    </div>
                  <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2">Rate Limiting</p>
                        <p className="font-sans font-extralight text-white">Quell protects your app against abuse and DoS attacks with robust rate limiting.</p>
                     </div>
                </div>
                <div className="flex flex-row">
                      <div className="self-start mt-3 mr-2">
                        <img src={lightningIcon}/>
                      </div>
                      <div className="flex flex-col mb-3 md:w-2/3">
                        <p className="font-sans font-semibold text-white py-2"> Data Protection</p>
                        <p className="font-sans font-extralight text-white">Use Quell to safeguard your data and granular access controls and authorization.</p>
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



  