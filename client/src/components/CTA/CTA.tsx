import React from 'react';

export const CTA = () => {
  return (
  <section id="CTA">
  <div className="grow relative pt-14">
    <div className="container bg-background flex flex-col mx-auto px-6 py-8 space-y-0 lg:flex-row lg:justify-around">
      <div className="flex flex-col mb-3 lg:w-1/2">
          <h1 className="leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl ">Query without worry</h1>
          <p className="font-sans font-extralight text-white mb-6 lg:text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
        </div>
        <div className="h-12 lg:h-auto">
        <button className="bg-transparent border border-lightblue text-lightblue font-sans py-3 px-6 rounded w-full hover:bg-lightblue hover:text-white md:text-xl">npm install</button>
        </div>
      </div>
  </div>
</section>
)
}





