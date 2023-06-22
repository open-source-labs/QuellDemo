"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("@monaco-editor/react"));
const helperFunctions_1 = require("../helperFunctions");
const QueryEditor = ({ setQuery, selectedQuery }) => {
    const handleChange = (value, ev) => {
        console.log(value);
        setQuery(value);
    };
    const query = helperFunctions_1.querySamples[selectedQuery];
    return ((0, jsx_runtime_1.jsx)("div", { className: "h-64 p-5 rounded-xl overflow-hidden", children: (0, jsx_runtime_1.jsx)(react_1.default
        // className={styles.editor}
        , { 
            // className={styles.editor}
            defaultLanguage: "graphql", value: query, onChange: handleChange, options: {
                scrollBeyondLastLine: true,
                wordWrap: 'wordWrapColumn',
            } }) }));
};
exports.QueryEditor = QueryEditor;
