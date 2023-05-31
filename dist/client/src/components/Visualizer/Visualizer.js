"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visualizer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Visualizer_modules_css_1 = __importDefault(require("./Visualizer.modules.css"));
const FlowTree_1 = __importDefault(require("./FlowTree"));
const FlowTable_1 = __importDefault(require("./FlowTable"));
function Visualizer({ query }) {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: Visualizer_modules_css_1.default.graphContainer }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Execution Tree" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: Visualizer_modules_css_1.default.flowTree }, { children: (0, jsx_runtime_1.jsx)(FlowTree_1.default, { query: query }) })), (0, jsx_runtime_1.jsx)("h2", { children: " Execution Table " }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: Visualizer_modules_css_1.default.flowTable }, { children: (0, jsx_runtime_1.jsx)(FlowTable_1.default, { query: query }) }))] })));
}
exports.Visualizer = Visualizer;
