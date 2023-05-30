import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Linkedin from '/client/src/assets/images/icons/QUELL-icons-linkedin.svg';
import Github from '/client/src/assets/images/icons/QUELL-icons-github.svg';
import { TeamArr } from '../teaminfo';

export const Team = () => {

  return (
    <section id ="team">
      <div className="container bg-background flex flex-col w-[110%] items-center px-6 mx-auto pt-10 content-start space-y-0 ">
        <div className="leading-snug text-xl font-sans font-semibold text-white sm:text-3xl md:text-4xl xl:text-5xl md:leading-snug xl:leading-snug">
          Meet the Quell Team
        </div>
        <div className="pt-4 leading-snug text-lg font-sans font-light text-white items-center text-center md:text-2xl md:leading-snug xl:leading-snug xl:w-3/4">
          Quell is an open-source platform with room for many more features. We welcome contributors in joining us!
        </div>
        <Link to="https://github.com/open-source-labs/Quell">
          <button className="m-6 bg-lightblue hover:bg-altblue text-black py-2 px-4 rounded md:text-base xl:text-xl">
            See Quell GitHub
          </button>
        </Link>
        {/* grid classifies what it is, default 1; uses responsive design; gap-4 creates a gap of 1rm between profile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white py-8" >
          {TeamArr.map((member, index) => (
            <div key={index} 
              className={`profile rounded-lg bg-zinc-700 drop-shadow-lg p-5 flex flex-col gap-y-4 items-center justify-center relative `} 
              >
              <div className="relative border-2 border-sky-300 w-32 h-32 drop-shadow-lg rounded-full overflow-hidden">
                <img src={member.src} alt={member.name} className='absolute inset-0 w-1000 h-1000' />
              </div>
              <div className="drop-shadow-lg">{member.name}</div>
              <div className="flex flex-row gap-4">
                <a href={member.linkedin} target='_blank'>
                  <button className="w-7 h-7 drop-shadow-lg hover:blur-xs">
                    <img src={Linkedin} alt="LinkedIn"/>
                  </button>
                </a>
                <a href={member.github} target='_blank'>
                  <button className="w-7 h-7 drop-shadow-lg hover:blur-xs">
                    <img src={Github} alt="Github"/>
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}