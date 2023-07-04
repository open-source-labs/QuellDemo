"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = require("./NavBar/Navbar");
const Demo_1 = __importDefault(require("./Demo/Demo"));
const Hero_1 = require("./Hero/Hero");
const Footer_1 = require("./Footer/Footer");
const Team_1 = require("./Team/Team");
const Features_1 = require("./Features/Features");
const Feature_Callouts_1 = require("./Feature-Callouts/Feature-Callouts");
const CTA_1 = require("./CTA/CTA");
const Demo_Header_1 = require("./Demo/Demo-Header");
// Lazy loading the TeamCards component
const LazyLoadTeam = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require('./TeamCards/TeamCards'))));
function App() {
    const [renderFx, toggleRenderFx] = (0, react_1.useState)('');
    const [teamComp, toggleRenderTeam] = (0, react_1.useState)(false);
    // Runs once on render to trigger the state change for renderedFx
    // This string is an ID in our CSS
    (0, react_1.useEffect)(() => {
        toggleRenderFx('rendered');
    }, []);
    (0, react_1.useEffect)(() => { }, [teamComp]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "m-0 p-0 bg-background flex flex-col w-full xl:pl-16 xl:pr-16", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsx)(Navbar_1.Navbar, { teamComp: teamComp, toggleRenderTeam: toggleRenderTeam }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Hero_1.Hero, {}), (0, jsx_runtime_1.jsx)(Features_1.Features, {}), (0, jsx_runtime_1.jsx)(Demo_Header_1.DemoHeader, {}), (0, jsx_runtime_1.jsx)(Demo_1.default, {}), (0, jsx_runtime_1.jsx)(Feature_Callouts_1.FeatureCallouts, {}), (0, jsx_runtime_1.jsx)(CTA_1.CTA, {})] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/team", element: (0, jsx_runtime_1.jsx)(Team_1.Team, {}) })] }), (0, jsx_runtime_1.jsx)(Footer_1.Footer, {})] }) }));
}
exports.default = App;
