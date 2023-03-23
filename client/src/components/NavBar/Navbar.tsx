import { Dispatch, useEffect, useState, SetStateAction } from 'react';
import {
  Button,
  Stack,
  Divider,
  AppBar,
  Box,
  Fade,
  Slide,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Hidden,
  Link,
} from '@mui/material';
import styles from './NavBar.modules.css';
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';
import {
  Menu as MenuIcon,
  DeveloperBoard,
  Code,
  MenuBook,
  Groups2,
} from '@mui/icons-material';

interface Navbar {
  toggleRenderTeam: Dispatch<SetStateAction<boolean>>;
  teamComp: boolean;
}

export function Navbar({ teamComp, toggleRenderTeam }: Navbar) {
  const [rendered, setRendered] = useState<boolean>(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    setRendered(true);
  }, []);

  const BirdLogo = () => {
    const [birdEffect, toggleBirdEffect] = useState<string>('');

    useEffect(() => {
      setTimeout(() => {
        toggleBirdEffect('quell-bird-pick');
        setTimeout(() => {
          toggleBirdEffect('');
        }, 800);
      }, 450);
    }, []);

    return (
      <Box>
        <img
          className="quell-bird-logo"
          id={birdEffect}
          src={quellBirdIcon}
          height="30px"
          width="30px"
        />
      </Box>
    );
  };

  //BUTTON HELPER COMPONENTS
  const AboutButton = () => {
    const [hover, setHover] = useState<boolean>(false);

    return (
      <Button
        onClick={() => {
          teamComp ? toggleRenderTeam(false) : null;
        }}
        href="#scroll-about"
        sx={{
          minWidth: '85px',
          boxShadow: 'none',
          minHeight: '40px',
          maxHeight: '40px',
          maxWidth: '90px',
          border: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        color="secondary"
        variant="contained"
      >
        <Slide
          direction="down"
          timeout={{ enter: 400, exit: 350 }}
          in={!hover}
          mountOnEnter
          unmountOnExit
        >
          <Typography sx={{ position: 'relative' }} variant="button">
            About
          </Typography>
        </Slide>
        <Slide
          direction="up"
          timeout={{ enter: 400, exit: 100 }}
          in={hover}
          mountOnEnter
          unmountOnExit
        >
          <Groups2 />
        </Slide>
      </Button>
    );
  };

  const DemoButton = () => {
    const [hover, setHover] = useState<boolean>(false);
    return (
      <Button
        onClick={() => {
          teamComp ? toggleRenderTeam(false) : null;
        }}
        href="#scroll-demo"
        sx={{
          minWidth: '85px',
          boxShadow: 'none',
          minHeight: '40px',
          maxHeight: '40px',
          maxWidth: '90px',
          border: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        color="secondary"
        variant="contained"
      >
        <Slide
          direction="down"
          timeout={{ enter: 400, exit: 350 }}
          in={!hover}
          mountOnEnter
          unmountOnExit
        >
          <Typography sx={{ position: 'relative' }} variant="button">
            Demo
          </Typography>
        </Slide>
        <Slide
          direction="up"
          timeout={{ enter: 400, exit: 100 }}
          in={hover}
          mountOnEnter
          unmountOnExit
        >
          <Code sx={{ position: 'relative' }} />
        </Slide>
      </Button>
    );
  };

  const DocsButton = () => {
    const [hover, setHover] = useState<boolean>(false);
    return (
      <Link
        sx={{ textDecoration: 'none' }}
        target="_blank"
        href="https://github.com/open-source-labs/Quell#quell"
        rel="noreferrer"
      >
        <Button
          sx={{
            minWidth: '85px',
            minHeight: '40px',
            maxHeight: '40px',
            maxWidth: '90px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'none',
            boxShadow: 'none',
          }}
          color="secondary"
          variant="contained"
        >
          <Slide
            direction="down"
            timeout={{ enter: 200, exit: 250 }}
            in={!hover}
            mountOnEnter
            unmountOnExit
          >
            <Typography variant="button">Docs</Typography>
          </Slide>
          <Slide
            direction="up"
            timeout={{ enter: 200, exit: 100 }}
            in={hover}
            mountOnEnter
            unmountOnExit
          >
            <MenuBook />
          </Slide>
        </Button>
      </Link>
    );
  };

  const TeamToggle = () => {
    return (
      <button
        className="teamBtn"
        onClick={() => {
          toggleRenderTeam(!teamComp);
        }}
      >
        {teamComp ? 'HOME' : 'TEAM'}
      </button>
    );
  };

  return (
    <AppBar
      id={rendered ? 'renderedNav' : ''}
      sx={{
        opacity: 0,
        minHeight: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '15px',
        paddingRight: '15px',
      }}
      color="primary"
      position="fixed"
      elevation={5}
    >
      {/* For Quell Bird Logo */}
      <BirdLogo />
      {/* Navmenu buttons */}
      <Stack
        className="navMenuContainer"
        sx={{ display: { xs: 'none', md: 'flex' } }}
        direction="row"
        justifyContent="center"
        divider={<Divider color="grey" orientation="vertical" flexItem />}
        spacing={2}
      >
        <AboutButton />
        <DemoButton />
        <DocsButton />
      </Stack>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <TeamToggle />
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
        <IconButton
          size="large"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <MenuItem onClick={handleCloseNavMenu}>
            <AboutButton />
          </MenuItem>
          <MenuItem onClick={handleCloseNavMenu}>
            <DemoButton />
          </MenuItem>
          <MenuItem onClick={handleCloseNavMenu}>
            <DocsButton />
          </MenuItem>
          <MenuItem onClick={handleCloseNavMenu}>
            <TeamToggle />
          </MenuItem>
        </Menu>
      </Box>
    </AppBar>
  );
}

// export function LogoAndNav() {
//   const [rendered, toggleRender] = useState<String>('unrenderedLogo')

//   //runs once on render, then procs the useState for rendered to change to renderedLogo
//   //these two strings are ID's in our CSS.
//   useEffect(() => {
//     setTimeout(() => {
//       toggleRender('renderedLogo')
//     }, 500);
//   }, [])

//   return (
//    <>
//     <div className="logoContainer">
//       <img src={logo} height="270px" width="500px" className="logo" id={`${rendered}`} alt="Quell" />
//     </div>
//     <NavBar />
//    </>
//   )
// }

// function NavBar()  {
//   const [stickyId, setStickyId] = useState<string>('');

//   useEffect(() => {
//     window.addEventListener('scroll', stickNavbar);
//     return () => window.removeEventListener('scroll', stickNavbar);
//   }, [])

//   const stickNavbar = () => {
//     if (window !== undefined) {
//       let windowHeight = window.scrollY;
//       // window height changed for the demo
//       windowHeight > 280 ? setStickyId('sticky-nav') : setStickyId('');
//     }
//   };

//   return (
//     <div id={`${stickyId}`} className="navbar">
//      <Stack direction="row" className="navMenuContainer" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
//        <Button href={"#demoContainer"} sx={{ border: 1 }} variant='contained'>Demo</Button>
//        <Button sx={{ border: 1 }} variant='contained'>Features</Button>
//        <Button sx={{ border: 1 }} variant='contained'>Team</Button>
//      </Stack>
//     </div>
//   )
// }
