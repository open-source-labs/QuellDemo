"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Footer_modules_css_1 = __importDefault(require("./Footer.modules.css"));
const quell_bird_svg_1 = __importDefault(require("/client/src/assets/images/quell_logos/quell-bird.svg"));
const GitHub_1 = __importDefault(require("@mui/icons-material/GitHub"));
const medium_icon_png_1 = __importDefault(require("/client/src/assets/images/icons/medium-icon.png"));
const react_1 = require("react");
const Footer = (0, react_1.memo)(() => {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: Footer_modules_css_1.default.container }, { children: [(0, jsx_runtime_1.jsx)("img", { className: "bird-icon", src: quell_bird_svg_1.default }), (0, jsx_runtime_1.jsxs)("p", Object.assign({ className: Footer_modules_css_1.default.text }, { children: ['\u00A9', "2023 Quell | MIT License"] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: Footer_modules_css_1.default.links }, { children: [(0, jsx_runtime_1.jsx)("a", Object.assign({ href: "https://github.com/open-source-labs/Quell" }, { children: (0, jsx_runtime_1.jsx)(GitHub_1.default, { className: Footer_modules_css_1.default.githubIcon }) })), (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "https://medium.com/@quellcache/boost-graphql-performance-with-quell-a-powerful-developer-friendly-caching-solution-4b32218dc640" }, { children: (0, jsx_runtime_1.jsx)("img", { className: Footer_modules_css_1.default.mediumIcon, src: medium_icon_png_1.default }) }))] }))] })));
});
exports.default = Footer;
