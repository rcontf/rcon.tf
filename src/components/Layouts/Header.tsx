import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import { Avatar, Link as StyledLink } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import useUser from '../../contexts/UserContext';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  menuLink: {
    color: '#FFF',
    textDecoration: 'none',
  },
}));

interface HeaderProps {
  login: () => void;
  logout: () => void;
}

export default function Header({ login, logout }: HeaderProps) {
  const classes = useStyles();
  const { user, isLoading } = useUser();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            <StyledLink to='/' color='inherit' component={Link}>
              rcon.tf
            </StyledLink>
          </Typography>

          {isLoading && (
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              color='inherit'
            >
              <Avatar src='K' />
            </IconButton>
          )}

          {!isLoading && !user && (
            <Button variant='text' onClick={login}>
              Login
            </Button>
          )}

          {!isLoading && user && (
            <>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenuOpen}
                color='inherit'
              >
                <Avatar src={user.avatar} />
              </IconButton>
              <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                disableScrollLock={true}
              >
                <MenuItem>
                  <Link to='/' className={classes.menuLink}>
                    Home
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to='/profile' className={classes.menuLink}>
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to='/servers' className={classes.menuLink}>
                    Servers
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => logout()}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
