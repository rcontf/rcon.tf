import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/users/userSlice';
import IconButton from '@material-ui/core/IconButton';
import { Avatar } from '@material-ui/core';

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
}));

interface HeaderProps {
  login: () => void;
  logout: () => void;
}

export default function Header({ login, logout }: HeaderProps) {
  const classes = useStyles();

  const user = useSelector(userSelector);

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            rcon.tf
          </Typography>

          {user?.id?.length ? (
            <div>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={logout}
                color='inherit'
              >
                <Avatar src={user.avatar} />
              </IconButton>
            </div>
          ) : (
            <Button variant='text' onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
