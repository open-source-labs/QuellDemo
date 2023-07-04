"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visualizer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const FlowTree_1 = __importDefault(require("./FlowTree"));
const FlowTable_1 = __importDefault(require("./FlowTable"));
function Visualizer({ query, elapsed }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center items-center gap-5", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-center text-white", children: "Execution Tree" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gray-700 h-96 w-[90%] rounded-lg", children: (0, jsx_runtime_1.jsx)(FlowTree_1.default, { query: query, elapsed: elapsed }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-center text-white", children: " Execution Table " }), (0, jsx_runtime_1.jsx)("div", { className: "w-[90%] rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)(FlowTable_1.default, { query: query, elapsed: elapsed }) })] }));
}
exports.Visualizer = Visualizer;
