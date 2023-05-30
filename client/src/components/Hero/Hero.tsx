import React, { useState, useEffect, useRef } from 'react';
import heroGraphic from '/client/src/assets/images/graphics/QUELL-hero-graphic.svg';
import clipboardGraphic from '/client/src/assets/images/graphics/clipboard.svg';


export const Hero = () => {

  // Store button text
  const [buttonText, setButtonText] = useState('npm install @quell/client');

  // Reference button element
  const buttonRef = useRef(null)

  // Function to copy text to clipboard on button click
  const handleButtonClick = () => {
    navigator.clipboard.writeText(buttonText)
      .then(() => {
        setButtonText('Copied!');
        setTimeout(() => {
          setButtonText('npm install @quell/client')
        }, 2000);
      })
      .catch((error) => {
        console.log('Failed to copy text:', error);
      });
  };

  useEffect(() => {
    if (buttonText === 'Copied!') {
      const timeoutId = setTimeout(() => {
        setButtonText('npm install @quell/client');
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [buttonText]);


  return (
    <section id="hero">
      <div className="grow relative pt-6 md:pt-14">
      <div className="container bg-background flex flex-col items-center px-6 mx-auto pt-10 content-start space-y-0 md:flex-row md:space-y-0 md:gap-12 xl:justify-between">
        <div className="flex flex-col mb-16 md:mb-32 space-y-12 md:w-1/2 md:space-y-8">
          <h1 className="leading-snug text-4xl font-sans font-semibold text-white md:text-2xl md:leading-snug lg:text-4xl lg:leading-snug xl:text-5xl xl:leading-snug xl:w-full">
            The lightweight caching solution for GraphQL developers
          </h1>
          <div className="flex flex-col justify-center gap-4 xl:gap-12 xl:justify-start xl:flex-row">
            <button className="bg-lightblue text-white font-sans py-3 px-14 rounded hover:bg-altblue md:text-base xl:text-xl">Try Demo</button>
            <div ref={buttonRef} key={buttonText} className="flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8" onClick={handleButtonClick} >
              <div className="flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg">{buttonText}</div>
              <img className="w-5 h-auto"src={clipboardGraphic} alt="Clipboard Graphic"/>
            </div>
          </div>
        </div>
        <div className="md:self-start xl:pr-16">
          <img className="w-full h-auto xl:w-auto xl:h-full" src={heroGraphic} alt="Hero Graphic"/>
        </div>
      </div>
      </div>
    </section>
  );
};



// import styles from './About.modules.css';
// import quellBanner from '/client/src/assets/images/quell_logos/quell-logo-square-no-padding.svg';
// import EggOutlinedIcon from '@mui/icons-material/EggOutlined';
// import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
// import { memo, useState } from 'react';
// import { Collapse } from '@mui/material';

// const About = memo(() => {
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   const handleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };
//   return (
//     <div id="about" className={styles.about}>
//       <div id="scroll-about"></div>
//       <div className={styles.bannerContainer}>
//         <img src={quellBanner} alt="quell-banner" id={styles.quellBanner} />
//       </div>
//       <div className={styles.contentContainer}>
//         <div>
//           <h1>Quell Your Querying Fears..</h1>
//           <h2>
//             Quell is an easy-to-use, lightweight JavaScript library providing a
//             client- and server-side caching solution for GraphQL.
//           </h2>

//         </div>
//         <Collapse in={!isCollapsed}>
//           <div id={styles.featuresContainer}>
//           <div className={styles.featureList}>
//             <EggOutlinedIcon
//               className={styles.eggIcon}
//               color="primary"
//               fontSize="large"
//             />
//             <div id="featureItem">
//               <h3 className={styles.featureHeading}>
//                 Fast + Accurate Caching for GraphQL Developers
//               </h3>
//               <span className={styles.featureContent}>
//                 Quell optimizes speed using both client and server side caching
//                 and accuracy with partial/exact query caching.
//               </span>
//             </div>
//           </div>
//           <div className={styles.featureList}>
//             <EggOutlinedIcon
//               className={styles.eggIcon}
//               color="primary"
//               fontSize="large"
//             />
//             <div id="featureItem">
//               <h3 className={styles.featureHeading}>
//                 Built-In Utilities for Security
//               </h3>
//               <span className={styles.featureContent}>
//                 No need to import or to code your own graphQL security
//                 solutions. Quell has optional built-in middleware packages that
//                 protect your endpoint from malicious attacks.
//               </span>
//             </div>
//           </div>
//           <div className={styles.featureList}>
//             <EggOutlinedIcon
//               className={styles.eggIcon}
//               color="primary"
//               fontSize="large"
//             />
//             <div id="featureItem">
//               <h3 className={styles.featureHeading}>
//                 Simple and Easy Installation + Detailed Documentation
//               </h3>
//               <span className={styles.featureContent}>
//                 Quell prides itself on being lightweight and simple. Use Quell
//                 alongside with our in-depth documentation to simplify things so
//                 you can get started on working ASAP!
//               </span>
//             </div>
//           </div>
//           <div className={styles.featureList}>
//             <EggOutlinedIcon
//               className={styles.eggIcon}
//               color="primary"
//               fontSize="large"
//             />
//             <div id="featureItem">
//               <h3 className={styles.featureHeading}>
//                 Query Monitoring + Cache View Devtool
//               </h3>
//               <span className={styles.featureContent}>
//                 Our dev tool contains all the metrics and utilities that a
//                 graphQL developer would need from query monitoring metrics to
//                 server cache data.
//                 <a
//                   id={styles.devToolText}
//                   href="https://chrome.google.com/webstore/detail/quell-developer-tool/jnegkegcgpgfomoolnjjkmkippoellod"
//                 >
//                   Download the dev tool from the official chrome store now!
//                 </a>
//               </span>
//             </div>
//           </div>
//           <div className={styles.featureList}>
//             <EggOutlinedIcon
//               className={styles.eggIcon}
//               color="primary"
//               fontSize="large"
//             />
//             <div id="featureItem">
//               <h3 className={styles.featureHeading}>Open Source</h3>
//               <span className={styles.featureContent}>
//                 Quell is more than happy to accept any contributions and tips
//                 from the open source community!
//               </span>
//             </div>
//           </div>
//           <div className={styles.featureList} id={styles.callToAction}>
//             <div id={styles.getStarted}>
//               <ArrowForwardRoundedIcon id={styles.arrow} fontSize="large" />
//               <a
//                 id={styles.getStartedText}
//                 href="https://github.com/open-source-labs/Quell"
//               >
//                 <span>Get Started!</span>
//               </a>
//             </div>
//           </div>
//           </div>
//         </Collapse>
//         <button className={styles.features} onClick={handleCollapse}>
//           {isCollapsed ? 'Show features\n▼' : '▲\nHide features'}
//         </button>
//       </div>
//     </div>
//   );
// });

