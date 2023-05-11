import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import '../stylesheets/App.css';
import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './NavBar/Navbar';
import Demo from './Demo/Demo';
import About from './About/About';
import Footer from './Footer/Footer';
const LazyLoadTeam = React.lazy(() => import('./TeamCards/TeamCards'));
function App() {
    const [renderFx, toggleRenderFx] = useState('');
    const [teamComp, toggleRenderTeam] = useState(false);
    //runs once on render, then procs the useState for rendered to change to renderedLogo
    //these two strings are ID's in our CSS.
    useEffect(() => {
        toggleRenderFx('rendered');
    }, []);
    useEffect(() => { }, [teamComp]);
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, { teamComp: teamComp, toggleRenderTeam: toggleRenderTeam }), _jsx(Suspense, Object.assign({ fallback: _jsx("div", { children: "Loading.." }) }, { children: teamComp ? _jsx(LazyLoadTeam, {}) : null })), _jsxs("div", Object.assign({ className: "main", id: renderFx }, { children: [!teamComp && _jsx(About, {}), !teamComp && _jsx(Demo, {})] })), _jsx(Footer, {})] }));
}
export default App;
