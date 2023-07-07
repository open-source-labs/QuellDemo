import quellLogo from '/client/src/assets/images/quell_logos/quell-logo-side.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export const Footer = () => {

  const scrollToTeamSection = () => {
    const teamSection = document.getElementById('team');
    if (teamSection) {
      window.scrollTo({
        top: teamSection.offsetTop,
        behavior: 'smooth',
      });
    }
  };
  
  return (
    <nav className="relative container mx-auto bg-background w-full p-8 text-white md:mt-14 md:mb-28 xl:max-w-10xl">
      <div className="flex items-center justify-between">
        <div className="pt-2">
          <Link to="/">
          <img className="bird-icon" src={quellLogo} />
          </Link>
        </div>
        <div className="hidden font-sans font-light space-x-12 md:flex">
          <a href="https://github.com/open-source-labs/Quell#quell" className="hover:underline underline-offset-8 decoration-lightblue">Docs</a>
          <Link to="/team" onClick={scrollToTeamSection}>
          <button className="hover:underline underline-offset-8 decoration-lightblue" onClick={scrollToTeamSection}>
            Team
          </button>
        </Link>
          <a href="https://medium.com/@quellcache/graphql-caching-made-easy-quell-9-0s-time-to-shine-57c684dee001" className="hover:underline underline-offset-8 decoration-lightblue">Blog</a>
        </div>
      </div>
    </nav>
  );
};
