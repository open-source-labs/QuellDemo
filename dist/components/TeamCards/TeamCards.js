import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './TeamCards.modules.css';
import { useState, useEffect, memo } from 'react';
import Linkedin from '/client/src/assets/images/icons/QUELL-icons-linkedin.svg';
import Github from '/client/src/assets/images/icons/QUELL-icons-github.svg';
import Header from '/client/src/assets/images/quell_logos/quell-bird-border.svg';
import { TeamArr } from '../teaminfo';
const Team = memo(() => {
    const [renderFx, toggleRenderFx] = useState('unrendered');
    // runs once on render, then procs the useState for rendered to change to renderedLogo
    // these two strings are ID's in our CSS.
    useEffect(() => {
        setTimeout(() => {
            toggleRenderFx('rendered');
        }, 550);
    }, []);
    //scrolls back to top
    useEffect(() => {
        if (window.location.href.includes('scroll-demo')) {
            window.scrollTo(0, 0);
        }
        window.scrollTo(0, 0);
    }, []);
    return (_jsxs("div", Object.assign({ id: renderFx }, { children: [_jsx("h1", Object.assign({ id: styles.heading }, { children: "Team Quell" })), _jsx("img", { id: styles.logo, src: Header }), _jsx("h2", { children: "The Good Eggs of Quell" }), _jsx("div", Object.assign({ id: styles.team }, { children: TeamArr.map((currTeamObj, i) => {
                    return (_jsx("article", Object.assign({ className: styles.card }, { children: _jsx(TeamMember, { src: currTeamObj.src, bio: currTeamObj.bio, name: currTeamObj.name, linkedin: currTeamObj.linkedin, github: currTeamObj.github }, i) }), i));
                }) }))] })));
});
const TeamMember = ({ src, bio, name, linkedin, github }) => {
    return (_jsxs("div", Object.assign({ className: styles.profilePic }, { children: [_jsx("img", { src: src, alt: "Quell Team Member" }), _jsx("p", Object.assign({ className: styles.name }, { children: name })), _jsx("p", { children: bio }), _jsxs("div", Object.assign({ className: styles.socialIcons }, { children: [_jsx("a", Object.assign({ href: linkedin, target: "_blank" }, { children: _jsx("img", { src: Linkedin }) })), _jsx("a", Object.assign({ href: github, target: "_blank" }, { children: _jsx("img", { src: Github }) }))] }))] })));
};
export default Team;
