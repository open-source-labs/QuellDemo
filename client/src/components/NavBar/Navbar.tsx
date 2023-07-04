import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { BrowserRouter as Router, Route, Link, HashRouter, useNavigate } from 'react-router-dom';
import quellLogo from '/client/src/assets/images/quell_logos/quell-logo-side.svg';
import hamburgerIcon from '/client/src/assets/images/graphics/hamburger.svg';

type NavbarProps = {
  teamComp: boolean; // Flag to determine if the team component is rendered
  toggleRenderTeam: Dispatch<SetStateAction<boolean>>; // Function to toggle the rendering of the team component
}

// Navbar component:
export const Navbar: React.FC<NavbarProps> = ({ teamComp, toggleRenderTeam }) => {
  // Hook for navigating to different routes
  const navigate = useNavigate();

  // State for checking if if the hamburger is open/closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to toggle the menu upon click
  const toggleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // Function close menu when clicking on nav bar item
  const closeMenu = () => setIsMenuOpen(false);

  // Function to close the menu when clicking outside of the menu
  useEffect(() => {
    // Check if the menuRef exists and the clicked element is not inside the menuRef
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Close the menu if the clicked element is outside the menu
        setIsMenuOpen(false);
      }
    };
    // Add event listener for click events on the window
    window.addEventListener('click', handleClickOutside);
    // Clean up the event listener when the component is unmounted or the dependencies change
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
          <Link to="/team">
            <span className="hover:underline underline-offset-8 decoration-lightblue">Team</span>
          </Link>
          <a href="https://medium.com/@quellcache/query-without-worry-quell-8-0-launches-to-amplify-graphql-queries-35448c694e4f" className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
        </div>
        <div className="block cursor-pointer md:hidden" onClick={toggleMenu}>
          <img className="w-4 h-auto" src={hamburgerIcon} alt="Hamburger Icon" />
        </div>
      </div>
      <div className={`md:hidden ${isMenuOpen ? '' : 'hidden'}`}>
        <div ref={menuRef} id="menu" className={`absolute flex flex-col items-center self-end py-8 mt-10 space-y-6 bg-background sm:w-auto sm:self-center left-6 right-6 drop-shadow-md ${isMenuOpen ? '' : 'hidden'}`} style={{ zIndex: 9999 }}>
          <a href='https://github.com/open-source-labs/Quell#quell' className="hover:underline underline-offset-8 decoration-lightblue">Docs</a>
          <Link to="/team" onClick={closeMenu} >
            <span className="hover:underline underline-offset-8 decoration-lightblue">Team</span>
          </Link>
          <a href='https://medium.com/@quellcache/query-without-worry-quell-8-0-launches-to-amplify-graphql-queries-35448c694e4f' className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
        </div>
      </div>
    </nav>
  );
};
