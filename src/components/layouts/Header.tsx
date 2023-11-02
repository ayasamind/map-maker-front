import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import EmojiFlags from '@mui/icons-material/EmojiFlags';
import Link from "next/link";
import { Auth } from "@/contexts/AuthContext";
import { signOut, GoogleAuthProvider } from "firebase/auth";
import firebaseAuth from '@/libs/firebaseAuth';
import { Loading } from "@/contexts/LoadingContext";
import { Popup } from "@/contexts/PopupContext";
import { getSuccssPopup } from "@/templates/PopupTemplates";


function Header() {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { auth, setAuth } = useContext(Auth);
  const { setLoading } = useContext(Loading);
  const { setPopup } = useContext(Popup);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    setLoading(true);
    signOut(firebaseAuth)
      .then(() => {
        console.log("Sign-out successful.");
        setAuth({});
        setLoading(false);
        setPopup(getSuccssPopup("Logout"));
        router.push('/');
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={() => router.push('/')}
              style={{ display: 'contents' }}
          >
            <EmojiFlags sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} fontSize="large" />
            <Typography
              variant="h6"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MapMaker
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => router.push('/maps/create')}>
                <Typography textAlign="center">
                  New
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <EmojiFlags sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} fontSize="large" />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => router.push('/')}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MapMaker
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => router.push('/maps/create')}
              >
                  <Typography textAlign="center">
                    New
                  </Typography>
              </Button>
          </Box>

           { Object.keys(auth).length !== 0 &&
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src={auth.user.image_url} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <Link href={ `/users/signin` }>SignIn</Link>
                  </Typography>
                </MenuItem> */}
                <MenuItem onClick={handleSignOut}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
              </Box>
            }
            { Object.keys(auth).length === 0 &&
              <Link color="white" href={ `/users/signin` }>
                  <Typography color="white" textAlign="center">SignIn</Typography>
              </Link>
            }
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;