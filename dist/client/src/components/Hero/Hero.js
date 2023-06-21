"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hero = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const QUELL_hero_graphic_svg_1 = __importDefault(require("/client/src/assets/images/graphics/QUELL-hero-graphic.svg"));
const clipboard_svg_1 = __importDefault(require("/client/src/assets/images/graphics/clipboard.svg"));
const Hero = () => {
    // Store button text
    const [buttonText, setButtonText] = (0, react_1.useState)('npm install @quell/client');
    // Reference button element
    const buttonRef = (0, react_1.useRef)(null);
    // Function to copy text to clipboard on button click
    const handleButtonClick = () => {
        navigator.clipboard.writeText(buttonText)
            .then(() => {
            setButtonText('Copied!');
            setTimeout(() => {
                setButtonText('npm install @quell/client');
            }, 2000);
        })
            .catch((error) => {
            console.log('Failed to copy text:', error);
        });
    };
    (0, react_1.useEffect)(() => {
        if (buttonText === 'Copied!') {
            const timeoutId = setTimeout(() => {
                setButtonText('npm install @quell/client');
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [buttonText]);
    return ((0, jsx_runtime_1.jsx)("section", { id: "hero", children: (0, jsx_runtime_1.jsx)("div", { className: "grow relative pt-6 md:pt-14", children: (0, jsx_runtime_1.jsxs)("div", { className: "container bg-background flex flex-col items-center px-6 mx-auto pt-10 content-start space-y-0 md:flex-row md:space-y-0 md:gap-12 xl:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col mb-16 md:mb-32 space-y-12 md:w-1/2 md:space-y-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "leading-snug text-4xl font-sans font-semibold text-white md:text-2xl md:leading-snug lg:text-4xl lg:leading-snug xl:text-5xl xl:leading-snug xl:w-full", children: "The lightweight caching solution for GraphQL developers" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center gap-4 xl:gap-12 xl:justify-start xl:flex-row", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => { var _a; return (_a = document.getElementById('Demo-Header')) === null || _a === void 0 ? void 0 : _a.scrollIntoView(); }, className: "bg-lightblue text-white font-sans py-3 px-14 rounded hover:bg-altblue md:text-base xl:text-xl", children: "Try Demo" }), (0, jsx_runtime_1.jsxs)("div", { ref: buttonRef, className: "flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8", onClick: handleButtonClick, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg", children: buttonText }), (0, jsx_runtime_1.jsx)("img", { className: "w-5 h-auto", src: clipboard_svg_1.default, alt: "Clipboard Graphic" })] }, buttonText)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "md:self-start xl:pr-16", children: (0, jsx_runtime_1.jsx)("img", { className: "w-full h-auto xl:w-auto xl:h-full", src: QUELL_hero_graphic_svg_1.default, alt: "Hero Graphic" }) })] }) }) }));
};
exports.Hero = Hero;
