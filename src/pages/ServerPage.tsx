import React, { useState, FormEvent, useRef, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import Server from '../components/Server';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  addServer,
  fetchServers,
  serverSelector,
} from '../redux/servers/serverSlice';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '5vh',
  },
  serverContainer: {
    width: '60%',
  },
}));

export default function ServerPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const servers = useSelector(serverSelector);

  const [addServerOpen, setAddServerOpen] = useState(false);

  const handleServerAdd = () => {
    // e.preventDefault();
    // if (!serverHostname || !serverIp || !serverPassword || !serverPort) return;
    // else {
    //   dispatch(
    //     addServer({
    //       hostname: serverHostname!.current!.value,
    //       ip: serverIp!.current!.value,
    //       password: serverPassword!.current!.value,
    //       port: parseInt(serverPort!.current!.value) ?? 27015,
    //     })
    //   );
    // }
  };

  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);

  return (
    <Layout>
      <Container className={classes.root}>
        <Grid
          container
          justify='center'
          alignItems='center'
          alignContent='center'
          direction='column'
          spacing={3}
        >
          <Grid item>
            <Typography variant='h4'>Select a Server</Typography>
          </Grid>
          <Grid item>
            <Button variant='outlined' onClick={() => setAddServerOpen(true)}>
              Add
            </Button>
          </Grid>
          {servers.allServers.length ? (
            servers.allServers.map(server => (
              <Grid
                item
                key={server.hostname}
                className={classes.serverContainer}
              >
                <Server {...server} />
              </Grid>
            ))
          ) : (
            <Typography variant='h4'>Your server list is empty :/</Typography>
          )}
        </Grid>

        <Dialog
          open={addServerOpen}
          onClose={() => setAddServerOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Add a new Server</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Add a server to utilize the feature rich
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddServerOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => handleServerAdd()} color='primary' autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
