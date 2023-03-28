import { StyledEngineProvider } from '@mui/material/styles';
import styles from './Navbar.modules.css';
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
import quellBirdIcon from '/client/src/assets/images/quell_logos/quell-bird.svg';
import {
  Menu as MenuIcon,
  DeveloperBoard,
  Code,
  MenuBook,
  Groups2,
} from '@mui/icons-material';
import { trusted } from 'mongoose';

interface Navbar {
  toggleRenderTeam: Dispatch<SetStateAction<boolean>>;
  teamComp: boolean;
}

interface NavLink {
  id: string;
  href: string;
  text: string;
}

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
        <img className="bird-icon" id={birdEffect} src={quellBirdIcon} />
      </Box>
    );
  };

  const NavButton = ({ id, href, text }: NavLink) => {
    const [hover, setHover] = useState<boolean>(false);
    return (
      <Button
        id={id}
        onClick={() => {
          teamComp ? toggleRenderTeam(false) : null;
        }}
        disableElevation={true}
        href={href}
        sx={{
          width: '90px',
          height: '40px',
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
            {text}
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

  const TeamToggle = () => {
    const [hover, setHover] = useState<boolean>(false);

    return (
      <Button
        color="secondary"
        variant="contained"
        disableElevation={true}
        sx={{
          width: '90px',
          height: '40px',
        }}
        onClick={() => {
          toggleRenderTeam(!teamComp);
        }}
      >
        <Slide
          direction="down"
          timeout={{ enter: 400, exit: 350 }}
          in={!hover}
          mountOnEnter
          unmountOnExit
        >
          <Typography sx={{ position: 'relative' }} variant="button">
            {teamComp ? 'HOME' : 'TEAM'}
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

  const navButtons = Object.values(buttons).map((button) => {
    return <NavButton id={button.id} href={button.href} text={button.text} />;
  });

  return (
    <StyledEngineProvider injectFirst>
      <AppBar
        id={rendered ? styles.renderedNav : ''}
        className={styles.navBar}
        color="primary"
        position="sticky"
        elevation={5}
      >
        <BirdLogo />
        <Stack
          id={styles.horizontalMenu}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
          direction="row"
          justifyContent="center"
          divider={<Divider color="grey" orientation="vertical" flexItem />}
          spacing={2}
        >
          {navButtons}
        </Stack>
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <TeamToggle />
        </Box>
        <Box
          id={styles.verticalMenu}
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
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
            id={styles.dropDownMenu}
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
              display: { xs: 'block', sm: 'none' },
            }}
          >
            <MenuItem onClick={handleCloseNavMenu}>
              <NavButton
                id={buttons['about'].id}
                href={buttons['about'].href}
                text={buttons['about'].text}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>
              <NavButton
                id={buttons['demo'].id}
                href={buttons['demo'].href}
                text={buttons['demo'].text}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>
              <NavButton
                id={buttons['docs'].id}
                href={buttons['docs'].href}
                text={buttons['docs'].text}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>
              <TeamToggle />
            </MenuItem>
          </Menu>
        </Box>
      </AppBar>
    </StyledEngineProvider>
  );
}
