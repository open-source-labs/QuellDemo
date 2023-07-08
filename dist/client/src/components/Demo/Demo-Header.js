"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const DemoHeader = () => {
    return ((0, jsx_runtime_1.jsx)("section", { id: "Demo-Header", children: (0, jsx_runtime_1.jsx)("div", { className: "grow relative pt-18 md:pt-22 lg:pt-24", children: (0, jsx_runtime_1.jsxs)("div", { className: "container justify-center bg-background flex flex-col mx-auto px-6 py-8 space-y-0 items-center text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mt-8 lg:mt-0 leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl", children: "Experience Quell for yourself" }), (0, jsx_runtime_1.jsx)("p", { className: "font-sans font-extralight text-white mb-6 lg:text-xl", children: "Try a live demo to see how Quell transforms GraphQL queries." })] }) }) }));
};
exports.DemoHeader = DemoHeader;
