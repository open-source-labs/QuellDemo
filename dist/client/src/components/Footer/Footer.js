"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const quell_logo_side_svg_1 = __importDefault(require("/client/src/assets/images/quell_logos/quell-logo-side.svg"));
const react_router_dom_1 = require("react-router-dom");
const Footer = () => {
    const scrollToTeamSection = () => {
        const teamSection = document.getElementById('team');
        if (teamSection) {
            window.scrollTo({
                top: teamSection.offsetTop,
                behavior: 'smooth',
            });
        }
    };
    return ((0, jsx_runtime_1.jsx)("nav", { className: "relative container mx-auto bg-background w-full p-8 text-white md:mt-14 md:mb-28 xl:max-w-10xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "pt-2", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: (0, jsx_runtime_1.jsx)("img", { className: "bird-icon", src: quell_logo_side_svg_1.default }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden font-sans font-light space-x-12 md:flex", children: [(0, jsx_runtime_1.jsx)("a", { href: "https://github.com/open-source-labs/Quell#quell", className: "hover:underline underline-offset-8 decoration-lightblue", children: "Docs" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/team", onClick: scrollToTeamSection, children: (0, jsx_runtime_1.jsx)("button", { className: "hover:underline underline-offset-8 decoration-lightblue", onClick: scrollToTeamSection, children: "Team" }) }), (0, jsx_runtime_1.jsx)("a", { href: "https://medium.com/@quellcache/graphql-caching-made-easy-quell-9-0s-time-to-shine-57c684dee001", className: "hover:underline underline-offset-8 decoration-lightblue", children: "Blog" })] })] }) }));
};
exports.Footer = Footer;
