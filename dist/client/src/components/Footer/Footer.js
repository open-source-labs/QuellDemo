import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Footer.modules.css';
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import MediumIcon from '/client/src/assets/images/icons/medium-icon.png';
import { memo } from 'react';
const Footer = memo(() => {
    return (_jsxs("div", Object.assign({ className: styles.container }, { children: [_jsx("img", { className: "bird-icon", src: quellBirdIcon }), _jsxs("p", Object.assign({ className: styles.text }, { children: ['\u00A9', "2023 Quell | MIT License"] })), _jsxs("div", Object.assign({ id: styles.links }, { children: [_jsx("a", Object.assign({ href: "https://github.com/open-source-labs/Quell" }, { children: _jsx(GitHubIcon, { className: styles.githubIcon }) })), _jsx("a", Object.assign({ href: "https://medium.com/@quellcache/boost-graphql-performance-with-quell-a-powerful-developer-friendly-caching-solution-4b32218dc640" }, { children: _jsx("img", { className: styles.mediumIcon, src: MediumIcon }) }))] }))] })));
});
export default Footer;
