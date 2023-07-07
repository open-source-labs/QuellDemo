"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadQuery = exports.SuccessfulQuery = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Alert_modules_css_1 = __importDefault(require("./Alert.modules.css"));
const material_1 = require("@mui/material");
const react_1 = require("react");
const SuccessfulQuery = () => {
    const [rendered, toggleRendered] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        toggleRendered(true);
        //fades away
        setTimeout(() => {
            toggleRendered(false);
        }, 3000);
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { id: Alert_modules_css_1.default.container, children: (0, jsx_runtime_1.jsx)(material_1.Fade, { in: rendered, timeout: { enter: 600, exit: 550 }, mountOnEnter: true, unmountOnExit: true, children: (0, jsx_runtime_1.jsx)(material_1.Alert, { className: Alert_modules_css_1.default.alert, onClose: () => {
                    toggleRendered(false);
                }, severity: "success", children: "Successful Query!" }) }) }));
};
exports.SuccessfulQuery = SuccessfulQuery;
const BadQuery = (props) => {
    const [rendered, toggleRendered] = (0, react_1.useState)(false);
    const [errorMessage, setMessage] = (0, react_1.useState)('Invalid query!');
    (0, react_1.useEffect)(() => {
        toggleRendered(true);
        //fades away
        setTimeout(() => {
            toggleRendered(false);
        }, 3000);
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { id: Alert_modules_css_1.default.container, children: (0, jsx_runtime_1.jsx)(material_1.Fade, { in: rendered, timeout: { enter: 600, exit: 550 }, mountOnEnter: true, unmountOnExit: true, children: (0, jsx_runtime_1.jsx)(material_1.Alert, { className: Alert_modules_css_1.default.alert, onClose: () => {
                    toggleRendered(false);
                }, severity: "error", children: props.errorMessage }) }) }));
};
exports.BadQuery = BadQuery;
