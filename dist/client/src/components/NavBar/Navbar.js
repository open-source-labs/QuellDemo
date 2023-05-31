"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const styles_1 = require("@mui/material/styles");
const Navbar_modules_css_1 = __importDefault(require("./Navbar.modules.css"));
const react_1 = require("react");
const material_1 = require("@mui/material");
const quell_bird_svg_1 = __importDefault(require("/client/src/assets/images/quell_logos/quell-bird.svg"));
const icons_material_1 = require("@mui/icons-material");
const buttons = {
    about: { id: 'about', href: '#scroll-about', text: 'About' },
    demo: {
        id: 'demo',
        href: '#scroll-demo',
        text: 'Demo',
    },
    docs: {
        id: 'docs',
        href: 'https://github.com/open-source-labs/Quell#quell',
        text: 'Docs',
    },
};
function Navbar({ teamComp, toggleRenderTeam }) {
    const [rendered, setRendered] = (0, react_1.useState)(false);
    const [anchorElNav, setAnchorElNav] = (0, react_1.useState)(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    (0, react_1.useEffect)(() => {
        setRendered(true);
    }, []);
    const BirdLogo = () => {
        const [birdEffect, toggleBirdEffect] = (0, react_1.useState)('');
        (0, react_1.useEffect)(() => {
            setTimeout(() => {
                toggleBirdEffect('quell-bird-pick');
                setTimeout(() => {
                    toggleBirdEffect('');
                }, 800);
            }, 450);
        }, []);
        return ((0, jsx_runtime_1.jsx)(material_1.Box, { children: (0, jsx_runtime_1.jsx)("img", { className: "bird-icon", id: birdEffect, src: quell_bird_svg_1.default }) }));
    };
    const NavButton = ({ id, href, text }) => {
        const [hover, setHover] = (0, react_1.useState)(false);
        return ((0, jsx_runtime_1.jsxs)(material_1.Button, Object.assign({ id: id, onClick: () => {
                teamComp ? toggleRenderTeam(false) : null;
            }, disableElevation: true, href: href, sx: {
                width: '90px',
                height: '40px',
            }, color: "secondary", variant: "contained" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Slide, Object.assign({ direction: "down", timeout: { enter: 400, exit: 350 }, in: !hover, mountOnEnter: true, unmountOnExit: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { position: 'relative' }, variant: "button" }, { children: text })) })), (0, jsx_runtime_1.jsx)(material_1.Slide, Object.assign({ direction: "up", timeout: { enter: 400, exit: 100 }, in: hover, mountOnEnter: true, unmountOnExit: true }, { children: (0, jsx_runtime_1.jsx)(icons_material_1.Code, { sx: { position: 'relative' } }) }))] })));
    };
    const TeamToggle = () => {
        const [hover, setHover] = (0, react_1.useState)(false);
        return ((0, jsx_runtime_1.jsxs)(material_1.Button, Object.assign({ color: "secondary", variant: "contained", disableElevation: true, sx: {
                width: '90px',
                height: '40px',
            }, onClick: () => {
                toggleRenderTeam(!teamComp);
            } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Slide, Object.assign({ direction: "down", timeout: { enter: 400, exit: 350 }, in: !hover, mountOnEnter: true, unmountOnExit: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, Object.assign({ sx: { position: 'relative' }, variant: "button" }, { children: teamComp ? 'HOME' : 'TEAM' })) })), (0, jsx_runtime_1.jsx)(material_1.Slide, Object.assign({ direction: "up", timeout: { enter: 400, exit: 100 }, in: hover, mountOnEnter: true, unmountOnExit: true }, { children: (0, jsx_runtime_1.jsx)(icons_material_1.Code, { sx: { position: 'relative' } }) }))] })));
    };
    const navButtons = Object.values(buttons).map((button) => {
        return (0, jsx_runtime_1.jsx)(NavButton, { id: button.id, href: button.href, text: button.text });
    });
    return ((0, jsx_runtime_1.jsx)(styles_1.StyledEngineProvider, Object.assign({ injectFirst: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.AppBar, Object.assign({ id: rendered ? Navbar_modules_css_1.default.renderedNav : '', className: Navbar_modules_css_1.default.navBar, color: "primary", position: "sticky", elevation: 5 }, { children: [(0, jsx_runtime_1.jsx)(BirdLogo, {}), (0, jsx_runtime_1.jsx)(material_1.Stack, Object.assign({ id: Navbar_modules_css_1.default.horizontalMenu, sx: { display: { xs: 'none', sm: 'flex' } }, direction: "row", justifyContent: "center", divider: (0, jsx_runtime_1.jsx)(material_1.Divider, { color: "grey", orientation: "vertical", flexItem: true }), spacing: 2 }, { children: navButtons })), (0, jsx_runtime_1.jsx)(material_1.Box, Object.assign({ sx: { display: { xs: 'none', sm: 'flex' } } }, { children: (0, jsx_runtime_1.jsx)(TeamToggle, {}) })), (0, jsx_runtime_1.jsxs)(material_1.Box, Object.assign({ id: Navbar_modules_css_1.default.verticalMenu, sx: { display: { xs: 'flex', sm: 'none' } } }, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, Object.assign({ size: "large", "aria-controls": "menu-appbar", "aria-haspopup": "true", onClick: handleOpenNavMenu, color: "inherit" }, { children: (0, jsx_runtime_1.jsx)(icons_material_1.Menu, {}) })), (0, jsx_runtime_1.jsxs)(material_1.Menu, Object.assign({ id: Navbar_modules_css_1.default.dropDownMenu, anchorEl: anchorElNav, anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center',
                            }, keepMounted: true, transformOrigin: {
                                vertical: 'top',
                                horizontal: 'center',
                            }, open: Boolean(anchorElNav), onClose: handleCloseNavMenu, sx: {
                                display: { xs: 'block', sm: 'none' },
                            } }, { children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: (0, jsx_runtime_1.jsx)(NavButton, { id: buttons['about'].id, href: buttons['about'].href, text: buttons['about'].text }) })), (0, jsx_runtime_1.jsx)(material_1.MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: (0, jsx_runtime_1.jsx)(NavButton, { id: buttons['demo'].id, href: buttons['demo'].href, text: buttons['demo'].text }) })), (0, jsx_runtime_1.jsx)(material_1.MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: (0, jsx_runtime_1.jsx)(NavButton, { id: buttons['docs'].id, href: buttons['docs'].href, text: buttons['docs'].text }) })), (0, jsx_runtime_1.jsx)(material_1.MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: (0, jsx_runtime_1.jsx)(TeamToggle, {}) }))] }))] }))] })) })));
}
exports.Navbar = Navbar;
