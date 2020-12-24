import React, { useState, FormEvent, useRef, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import Server from '../components/Server';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import {
  addServer,
  fetchServers,
  serverSelector,
} from '../redux/servers/serverSlice';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '5vh',
  },
  modal: {
    position: 'absolute',
    width: 400,
    height: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 0,
  },
  serverContainer: {
    width: '60%',
  },
}));

export default function ServerPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const servers = useSelector(serverSelector);

  const [open, setOpen] = useState<boolean>(false);

  const serverIp = useRef<HTMLInputElement>();
  const serverPassword = useRef<HTMLInputElement>();
  const serverHostname = useRef<HTMLInputElement>();
  const serverPort = useRef<HTMLInputElement>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!serverHostname || !serverIp || !serverPassword || !serverPort) return;
    else {
      dispatch(
        addServer({
          hostname: serverHostname!.current!.value,
          ip: serverIp!.current!.value,
          password: serverPassword!.current!.value,
          port: parseInt(serverPort!.current!.value) ?? 27015,
        })
      );
    }
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
            <Button variant='outlined' onClick={handleOpen}>
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

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Paper className={classes.modal}>
            <h2 id='simple-modal-title'>Add server</h2>
            <form autoComplete='off' onSubmit={handleSubmit}>
              <Grid
                container
                alignItems='center'
                justify='center'
                direction='column'
                spacing={2}
              >
                <TextField
                  id='server-hostname'
                  label='Alias'
                  helperText='What do you want to call the server?'
                  fullWidth
                  required
                  inputRef={serverHostname}
                />
                <TextField
                  id='server-ip'
                  label='IP'
                  fullWidth
                  required
                  inputRef={serverIp}
                />
                <TextField
                  id='server-password'
                  label='Rcon Password'
                  fullWidth
                  required
                  inputRef={serverPassword}
                />
                <TextField
                  id='server-port'
                  label='Server port'
                  fullWidth
                  type='number'
                  defaultValue={27015}
                  inputRef={serverPort}
                />
                <TextField
                  id='server-type'
                  select
                  label='Type of server'
                  value='tf2'
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    disabled: true,
                  }}
                >
                  <MenuItem value='tf2'>Team Fortress 2</MenuItem>
                </TextField>
                <Grid item>
                  <Button variant='outlined' type='submit'>
                    Add server
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Modal>
      </Container>
    </Layout>
  );
}
