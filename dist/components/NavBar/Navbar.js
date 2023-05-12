import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyledEngineProvider } from '@mui/material/styles';
import styles from './Navbar.modules.css';
import { useEffect, useState } from 'react';
import { Button, Stack, Divider, AppBar, Box, Slide, IconButton, Menu, MenuItem, Typography, } from '@mui/material';
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';
import { Menu as MenuIcon, Code, } from '@mui/icons-material';
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
export function Navbar({ teamComp, toggleRenderTeam }) {
    const [rendered, setRendered] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    useEffect(() => {
        setRendered(true);
    }, []);
    const BirdLogo = () => {
        const [birdEffect, toggleBirdEffect] = useState('');
        useEffect(() => {
            setTimeout(() => {
                toggleBirdEffect('quell-bird-pick');
                setTimeout(() => {
                    toggleBirdEffect('');
                }, 800);
            }, 450);
        }, []);
        return (_jsx(Box, { children: _jsx("img", { className: "bird-icon", id: birdEffect, src: quellBirdIcon }) }));
    };
    const NavButton = ({ id, href, text }) => {
        const [hover, setHover] = useState(false);
        return (_jsxs(Button, Object.assign({ id: id, onClick: () => {
                teamComp ? toggleRenderTeam(false) : null;
            }, disableElevation: true, href: href, sx: {
                width: '90px',
                height: '40px',
            }, color: "secondary", variant: "contained" }, { children: [_jsx(Slide, Object.assign({ direction: "down", timeout: { enter: 400, exit: 350 }, in: !hover, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Typography, Object.assign({ sx: { position: 'relative' }, variant: "button" }, { children: text })) })), _jsx(Slide, Object.assign({ direction: "up", timeout: { enter: 400, exit: 100 }, in: hover, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Code, { sx: { position: 'relative' } }) }))] })));
    };
    const TeamToggle = () => {
        const [hover, setHover] = useState(false);
        return (_jsxs(Button, Object.assign({ color: "secondary", variant: "contained", disableElevation: true, sx: {
                width: '90px',
                height: '40px',
            }, onClick: () => {
                toggleRenderTeam(!teamComp);
            } }, { children: [_jsx(Slide, Object.assign({ direction: "down", timeout: { enter: 400, exit: 350 }, in: !hover, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Typography, Object.assign({ sx: { position: 'relative' }, variant: "button" }, { children: teamComp ? 'HOME' : 'TEAM' })) })), _jsx(Slide, Object.assign({ direction: "up", timeout: { enter: 400, exit: 100 }, in: hover, mountOnEnter: true, unmountOnExit: true }, { children: _jsx(Code, { sx: { position: 'relative' } }) }))] })));
    };
    const navButtons = Object.values(buttons).map((button) => {
        return _jsx(NavButton, { id: button.id, href: button.href, text: button.text });
    });
    return (_jsx(StyledEngineProvider, Object.assign({ injectFirst: true }, { children: _jsxs(AppBar, Object.assign({ id: rendered ? styles.renderedNav : '', className: styles.navBar, color: "primary", position: "sticky", elevation: 5 }, { children: [_jsx(BirdLogo, {}), _jsx(Stack, Object.assign({ id: styles.horizontalMenu, sx: { display: { xs: 'none', sm: 'flex' } }, direction: "row", justifyContent: "center", divider: _jsx(Divider, { color: "grey", orientation: "vertical", flexItem: true }), spacing: 2 }, { children: navButtons })), _jsx(Box, Object.assign({ sx: { display: { xs: 'none', sm: 'flex' } } }, { children: _jsx(TeamToggle, {}) })), _jsxs(Box, Object.assign({ id: styles.verticalMenu, sx: { display: { xs: 'flex', sm: 'none' } } }, { children: [_jsx(IconButton, Object.assign({ size: "large", "aria-controls": "menu-appbar", "aria-haspopup": "true", onClick: handleOpenNavMenu, color: "inherit" }, { children: _jsx(MenuIcon, {}) })), _jsxs(Menu, Object.assign({ id: styles.dropDownMenu, anchorEl: anchorElNav, anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center',
                            }, keepMounted: true, transformOrigin: {
                                vertical: 'top',
                                horizontal: 'center',
                            }, open: Boolean(anchorElNav), onClose: handleCloseNavMenu, sx: {
                                display: { xs: 'block', sm: 'none' },
                            } }, { children: [_jsx(MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: _jsx(NavButton, { id: buttons['about'].id, href: buttons['about'].href, text: buttons['about'].text }) })), _jsx(MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: _jsx(NavButton, { id: buttons['demo'].id, href: buttons['demo'].href, text: buttons['demo'].text }) })), _jsx(MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: _jsx(NavButton, { id: buttons['docs'].id, href: buttons['docs'].href, text: buttons['docs'].text }) })), _jsx(MenuItem, Object.assign({ onClick: handleCloseNavMenu }, { children: _jsx(TeamToggle, {}) }))] }))] }))] })) })));
}
