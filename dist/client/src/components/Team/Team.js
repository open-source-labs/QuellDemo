"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const QUELL_icons_linkedin_svg_1 = __importDefault(require("/client/src/assets/images/icons/QUELL-icons-linkedin.svg"));
const QUELL_icons_github_svg_1 = __importDefault(require("/client/src/assets/images/icons/QUELL-icons-github.svg"));
const teaminfo_1 = require("../teaminfo");
const Team = () => {
    return ((0, jsx_runtime_1.jsx)("section", { id: "team", children: (0, jsx_runtime_1.jsxs)("div", { className: "container bg-background flex flex-col items-center px-6 mx-auto pt-10 content-start space-y-0 ", children: [(0, jsx_runtime_1.jsx)("div", { className: "leading-snug text-xl font-sans font-semibold text-white sm:text-3xl md:text-4xl xl:text-5xl md:leading-snug xl:leading-snug", children: "Meet the Quell Team" }), (0, jsx_runtime_1.jsx)("div", { className: "pt-4 leading-snug text-lg font-sans font-light text-white items-center text-center md:text-2xl md:leading-snug xl:leading-snug xl:w-3/4", children: "Quell is an open-source platform with room for many more features. We welcome contributors in joining us!" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "https://github.com/open-source-labs/Quell", children: (0, jsx_runtime_1.jsx)("button", { className: "m-6 bg-lightblue hover:bg-altblue text-black py-4 px-6 rounded md:text-base xl:text-xl", children: "See Quell GitHub" }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white py-8", children: teaminfo_1.TeamArr.map((member, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `profile rounded-lg bg-zinc-700 drop-shadow-lg p-5 flex flex-col gap-y-4 items-center justify-center relative `, children: [(0, jsx_runtime_1.jsx)("div", { className: "relative border-2 border-sky-300 w-32 h-32 drop-shadow-lg rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: member.src, alt: member.name, className: 'absolute inset-0 w-1000 h-1000' }) }), (0, jsx_runtime_1.jsx)("div", { className: "drop-shadow-lg", children: member.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("a", { href: member.linkedin, target: '_blank', children: (0, jsx_runtime_1.jsx)("button", { className: "w-7 h-7 drop-shadow-lg hover:brightness-xl", children: (0, jsx_runtime_1.jsx)("img", { src: QUELL_icons_linkedin_svg_1.default, alt: "LinkedIn" }) }) }), (0, jsx_runtime_1.jsx)("a", { href: member.github, target: '_blank', children: (0, jsx_runtime_1.jsx)("button", { className: "w-7 h-7 drop-shadow-lg hover:shadow-xl", children: (0, jsx_runtime_1.jsx)("img", { src: QUELL_icons_github_svg_1.default, alt: "Github" }) }) })] })] }, index))) })] }) }));
};
exports.Team = Team;
