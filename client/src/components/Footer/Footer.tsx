import quellLogo from '/client/src/assets/images/quell_logos/quell-logo-side.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import { HashLink } from 'react-router-hash-link'; 

export const Footer = () => {
  return (
    <nav className="relative container mx-auto bg-background w-full p-8 text-white md:mb-28 xl:max-w-10xl">
      <div className="flex items-center justify-between">
        <div className="pt-2">
          <Link to="/">
          <img className="bird-icon" src={quellLogo} />
          </Link>
        </div>
        <div className="hidden font-sans font-light space-x-12 md:flex">
          <a href="#" className="hover:underline underline-offset-8 decoration-lightblue">Docs</a>
          {/* <a href="#" className="hover:underline underline-offset-8 decoration-lightblue">Team</a> */}
          <Link to="/team">
          <button className="hover:underline underline-offset-8 decoration-lightblue">
            Team
          </button>
        </Link>
          <a href="#" className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
          <a href="#" className="hover:underline underline-offset-8 decoration-lightblue">Try Demo</a>
        </div>
       <button id="menu-btn" className="block hambuger md:hidden focus:outline-none">
          <span className='hamburger-top'></span>
          <span className='hamburger-middle'></span>
          <span className='hamburger-bottom'></span>
        </button>  
      </div>
      <div className="md:hidden">
        <div id="menu" className="absolute flex flex-col items-center hidden self-end py-8 mt-10 space-y-6 bg-background sm:w-auto sm:self-center left-6 right-6 drop-shadow-md">
          <a href='#'>Docs</a>
          <a href='#'>Team</a>
          <a href='#'>Blog</a>
          <a href='#'>Try Demo</a>
        </div>
      </div>
    </nav>
  );
};
