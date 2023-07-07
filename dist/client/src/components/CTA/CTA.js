"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTA = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const clipboard_svg_1 = __importDefault(require("/client/src/assets/images/graphics/clipboard.svg"));
const CTA = () => {
    const [buttonTextClient, setButtonTextClient] = (0, react_1.useState)("npm install @quell/client");
    const [buttonTextServer, setButtonTextServer] = (0, react_1.useState)("npm install @quell/server");
    const [isServerButtonDisabled, setIsServerButtonDisabled] = (0, react_1.useState)(false);
    const buttonClientRef = (0, react_1.useRef)(null);
    const buttonServerRef = (0, react_1.useRef)(null);
    const handleClientButtonClick = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(buttonTextClient);
            setButtonTextClient("Copied!");
            setTimeout(() => {
                setButtonTextClient("npm install @quell/client");
            }, 2000);
        }
        catch (error) {
            console.log("Failed to copy text:", error);
        }
    });
    const debouncedServerButtonClick = (0, lodash_debounce_1.default)(() => {
        if (isServerButtonDisabled) {
            return;
        }
        setIsServerButtonDisabled(true);
        navigator.clipboard
            .writeText(buttonTextServer)
            .then(() => {
            setButtonTextServer("Copied!");
            setTimeout(() => {
                setButtonTextServer("npm install @quell/server");
                setIsServerButtonDisabled(false);
            }, 2000);
        })
            .catch((error) => {
            console.log("Failed to copy text:", error);
            setIsServerButtonDisabled(false);
        });
    }, 200);
    (0, react_1.useEffect)(() => {
        return () => {
            debouncedServerButtonClick.cancel();
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)("section", { id: "CTA", "data-testid": "cta-section", children: (0, jsx_runtime_1.jsx)("div", { className: "grow relative py-24 md:py-24 lg:py-36", children: (0, jsx_runtime_1.jsxs)("div", { className: "container bg-background flex flex-col mx-auto px-6 py-8 space-y-0 lg:flex-row lg:justify-around xl:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col mb-3 lg:w-2/3", children: [(0, jsx_runtime_1.jsx)("h1", { className: "leading-snug text-3xl font-sans font-semibold text-white mb-4 lg:text-4xl", children: "Query without worry" }), (0, jsx_runtime_1.jsx)("p", { className: "font-sans font-extralight text-white mb-6 lg:text-xl xl:w-3/4", "data-testid": "cta-explanation", children: "Let Quell take care of your GraphQL queries while you focus on building an incredible app for your users. Get started by installing Quell now." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-md text-white font-sans font-light", children: "To install and save in your package.json dependencies, run the command below using npm:" }), (0, jsx_runtime_1.jsxs)("div", { "data-testid": "cta-client-button", ref: buttonClientRef, className: "flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8", onClick: handleClientButtonClick, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg", children: buttonTextClient }), (0, jsx_runtime_1.jsx)("img", { className: "w-5 h-auto", src: clipboard_svg_1.default, alt: "Clipboard Graphic" })] }), (0, jsx_runtime_1.jsxs)("button", { ref: buttonServerRef, className: "flex flex-row rounded bg-transparent border border-lightblue justify-between px-4 cursor-pointer hover:bg-lightblue hover:text-white lg:px-6 xl:gap-8", onClick: debouncedServerButtonClick, disabled: isServerButtonDisabled, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-between text-white font-courier py-3 tracking-tighter xl:text-lg", children: buttonTextServer }), (0, jsx_runtime_1.jsx)("img", { className: "w-5 h-auto self-center", src: clipboard_svg_1.default, alt: "Clipboard Graphic" })] })] })] }) }) }));
};
exports.CTA = CTA;
