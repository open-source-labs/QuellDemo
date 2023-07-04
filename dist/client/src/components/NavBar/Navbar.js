"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const quell_logo_side_svg_1 = __importDefault(require("/client/src/assets/images/quell_logos/quell-logo-side.svg"));
const hamburger_svg_1 = __importDefault(require("/client/src/assets/images/graphics/hamburger.svg"));
// Navbar component:
const Navbar = ({ teamComp, toggleRenderTeam }) => {
    // Hook for navigating to different routes
    const navigate = (0, react_router_dom_1.useNavigate)();
    // State for checking if if the hamburger is open/closed
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const menuRef = (0, react_1.useRef)(null);
    // Function to toggle the menu upon click
    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };
    // Function close menu when clicking on nav bar item
    const closeMenu = () => setIsMenuOpen(false);
    // Function to close the menu when clicking outside of the menu
    (0, react_1.useEffect)(() => {
        // Check if the menuRef exists and the clicked element is not inside the menuRef
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Close the menu if the clicked element is outside the menu
                setIsMenuOpen(false);
            }
        };
        // Add event listener for click events on the window
        window.addEventListener('click', handleClickOutside);
        // Clean up the event listener when the component is unmounted or the dependencies change
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("nav", { className: "relative container mx-auto bg-background w-full p-8 text-white xl:max-w-10xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "pt-2", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", onClick: closeMenu, children: (0, jsx_runtime_1.jsx)("img", { className: "bird-icon", src: quell_logo_side_svg_1.default, alt: "Quell Logo" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden font-sans font-light space-x-12 md:flex", children: [(0, jsx_runtime_1.jsx)("a", { href: "https://github.com/open-source-labs/Quell#quell", className: "hover:underline underline-offset-8 decoration-lightblue", children: "Docs" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/team", children: (0, jsx_runtime_1.jsx)("span", { className: "hover:underline underline-offset-8 decoration-lightblue", children: "Team" }) }), (0, jsx_runtime_1.jsx)("a", { href: "https://medium.com/@quellcache/query-without-worry-quell-8-0-launches-to-amplify-graphql-queries-35448c694e4f", className: "hover:underline underline-offset-8 decoration-lightblue", children: "Blog" })] }), (0, jsx_runtime_1.jsx)("div", { className: "block cursor-pointer md:hidden", onClick: toggleMenu, children: (0, jsx_runtime_1.jsx)("img", { className: "w-4 h-auto", src: hamburger_svg_1.default, alt: "Hamburger Icon" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: `md:hidden ${isMenuOpen ? '' : 'hidden'}`, children: (0, jsx_runtime_1.jsxs)("div", { ref: menuRef, id: "menu", className: `absolute flex flex-col items-center self-end py-8 mt-10 space-y-6 bg-background sm:w-auto sm:self-center left-6 right-6 drop-shadow-md ${isMenuOpen ? '' : 'hidden'}`, style: { zIndex: 9999 }, children: [(0, jsx_runtime_1.jsx)("a", { href: 'https://github.com/open-source-labs/Quell#quell', className: "hover:underline underline-offset-8 decoration-lightblue", children: "Docs" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/team", onClick: closeMenu, children: (0, jsx_runtime_1.jsx)("span", { className: "hover:underline underline-offset-8 decoration-lightblue", children: "Team" }) }), (0, jsx_runtime_1.jsx)("a", { href: 'https://medium.com/@quellcache/query-without-worry-quell-8-0-launches-to-amplify-graphql-queries-35448c694e4f', className: "hover:underline underline-offset-8 decoration-lightblue", children: "Blog" })] }) })] }));
};
exports.Navbar = Navbar;
