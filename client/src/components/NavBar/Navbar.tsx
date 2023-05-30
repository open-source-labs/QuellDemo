import quellLogo from '/client/src/assets/images/quell_logos/quell-logo-side.svg';
import hamburgerIcon from '/client/src/assets/images/graphics/hamburger.svg';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import { HashLink } from 'react-router-hash-link'; 

export const Navbar: React.FC = () => {

  // State for checking if if the hamburger is open/closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to toggle the menu upon click
  const toggleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Function close menu when clicking on nav bar item
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to close menu when clicking outside of the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="relative container mx-auto bg-background w-full p-8 text-white xl:max-w-10xl">
      <div className="flex items-center justify-between">
        <div className="pt-2">
          <Link to="/" onClick={closeMenu}>
            <img className="bird-icon" src={quellLogo} alt="Quell Logo" />
          </Link>
        </div>
        <div className="hidden font-sans font-light space-x-12 md:flex">
          <a href="https://github.com/open-source-labs/Quell#quell" className="hover:underline underline-offset-8 decoration-lightblue">Docs</a>
          <Link to="/team"><a className="hover:underline underline-offset-8 decoration-lightblue">Team</a></Link>
          <a href="#" className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
          <a onClick={() => document.getElementById('Demo-Header')?.scrollIntoView()} className="hover:underline underline-offset-8 decoration-lightblue">Try Demo</a>
        </div>
        <div className="block cursor-pointer md:hidden" onClick={toggleMenu}>
          <img className="w-4 h-auto" src={hamburgerIcon} alt="Hamburger Icon" />
        </div>
      </div>
      <div className={`md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
        <div ref={menuRef} id="menu" className={`absolute flex flex-col items-center self-end py-8 mt-10 space-y-6 bg-background sm:w-auto sm:self-center left-6 right-6 drop-shadow-md ${isMenuOpen ? '' : 'hidden'}`} style={{ zIndex: 9999 }}>
          <a href='#' className="hover:underline underline-offset-8 decoration-lightblue">Docs</a>
          <Link to="/team" onClick={closeMenu}><a href='#' className="hover:underline underline-offset-8 decoration-lightblue">Team</a></Link>
          <a href='#' className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
          <a onClick={() => document.getElementById('Demo-Header')?.scrollIntoView()} className="hover:underline underline-offset-8 decoration-lightblue">Try Demo</a>
        </div>
      </div>
    </nav>
  );
};
