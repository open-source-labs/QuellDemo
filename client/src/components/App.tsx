import { StyledEngineProvider } from '@mui/material/styles';
import '../stylesheets/App.css';
import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './NavBar/Navbar';
import Demo from './Demo/Demo';
import About from './About/About';
import Footer from './Footer/Footer';

const LazyLoadTeam = React.lazy(() => import('./TeamCards/TeamCards'));

function App() {
  const [renderFx, toggleRenderFx] = useState<string>('');
  const [teamComp, toggleRenderTeam] = useState<boolean>(false);

  //runs once on render, then procs the useState for rendered to change to renderedLogo
  //these two strings are ID's in our CSS.
  useEffect(() => {
    toggleRenderFx('rendered');
  }, []);

  useEffect(() => {}, [teamComp]);

  return (
    <>
      {/* <StyledEngineProvider injectFirst> */}
      <Navbar teamComp={teamComp} toggleRenderTeam={toggleRenderTeam} />
      {/* conditionally renders between the team page and the main page. */}
      <Suspense fallback={<div>Loading..</div>}>
        {teamComp ? <LazyLoadTeam /> : null}
      </Suspense>
      <div className="main" id={renderFx}>
        {!teamComp && <About />}
        {!teamComp && <Demo />}
      </div>
      <Footer />
      {/* </StyledEngineProvider> */}
    </>
  );
}

export default App;
