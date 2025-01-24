import * as React from 'react';
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
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axios';
import CartWidget from './CartWidget';
import useLocalStorageState from 'use-local-storage-state';
import { CartProps } from '../interfaces/interfaces';

const pages = ['All Items', 'My orders'];

function HeaderMenu() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const userRole = localStorage.getItem('userRole') || "user"

  const navigate = useNavigate();


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

  const handleOpenItems = () => {
    navigate('/items')
  }

  const handleOpenMyOrders = () => {
    navigate('/orders')
  }

  const handleOpenUsers = () => {
    navigate('/users')
  }

  const handleOpenPage = (page: String) => {
    switch(page) {
      case 'All Items' : 
        navigate('/items')
        break;
      case 'My orders':
        navigate('/orders')
        break;
      case 'All Users':
        navigate('/users')
        break;
    }   
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.warn('No token found');
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.delete('/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  const handleSettings = () => {
    navigate('/profile')
  }

  const [cart,] = useLocalStorageState<CartProps>('cart', {})
  const itemsCount: number = Object.keys(cart || {}).length

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <CartWidget itemsCount={itemsCount} />
          </Box>

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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem key='All Items' onClick={handleOpenItems}>
                <Typography sx={{ textAlign: 'center' }}>All Items</Typography>
              </MenuItem>
              <MenuItem key='My orders' onClick={handleOpenMyOrders}>
                <Typography sx={{ textAlign: 'center' }}>My orders</Typography>
              </MenuItem>
              {userRole === 'admin' && (
                <MenuItem key='All Users' onClick={handleOpenUsers}>
                  <Typography sx={{ textAlign: 'center' }}>All Users</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <CartWidget itemsCount={itemsCount} />
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {handleOpenPage(page)}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
            {userRole === 'admin' && (
              <Button
                key="All Users"
                onClick={() => {handleOpenPage("All Users")}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                All Users
              </Button>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              <MenuItem key='Settings' onClick={handleSettings}>
                <Typography sx={{ textAlign: 'center' }}>Settings</Typography>
              </MenuItem>
              <MenuItem key='Logout' onClick={handleLogout}>
                <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HeaderMenu;
