import React from 'react'
import { Link } from 'react-router-dom';
import Linkedin from '/client/src/assets/images/icons/QUELL-icons-linkedin.svg';
import Github from '/client/src/assets/images/icons/QUELL-icons-github.svg';
import { TeamArr } from '../teaminfo';

export const Team = () => {

  return (
    <section id ="team">
      <div className="container bg-background flex flex-col items-center px-6 mx-auto pt-10 content-start space-y-0 ">
        <div className="leading-snug text-xl font-sans font-semibold text-white md:text-4xl md:leading-snug xl:text-3xl xl:leading-snug xl:w-full">
          Meet the Quell Team
        </div>
        <Link to="https://github.com/open-source-labs/Quell">
          <button className="bg-lightblue hover:bg-altblue text-black py-2 px-4 rounded md:text-base xl:text-xl">
            See Quell GitHub
          </button>
        </Link>
        {/* grid classifies what it is, default 1; uses responsive design; gap-4 creates a gap of 1rm between profile */}
        <div className = " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white">
          {TeamArr.map((member, index) => (
            <div key={index} className="profile border border-darkgrey rounded p-5 flex flex-col gap-y-4 items-center justify-center">
              <div className="relative border-2 border-cyan-900 w-32 h-32 rounded-full overflow-hidden">
                <img src={member.src} alt={member.name} className='absolute inset-0 w-1000 h-1000' />
              </div>
              <div>{member.name}</div>
              <div className="flex flex-row gap-4">
                <a href={member.linkedin} target='_blank'>
                  <button className="w-7 h-7 hover:blur-xs">
                    <img src={Linkedin} ></img>
                  </button>
                </a>
                <a href={member.github} target='_blank'>
                  <button className="w-7 h-7 hover:blur-xs">
                    <img src={Github}></img>
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
