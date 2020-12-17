import React, { useState, useEffect, FormEvent, useRef } from 'react';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { GetServerResponse } from '../types/types';
import Server from '../components/Server';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '5vh',
  },
  paper: {
    position: 'absolute',
    width: 400,
    height: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  serverContainer: {
    width: '60%',
  },
}));

export default function DashboardPage() {
  const classes = useStyles();

  const [refreshServers, setRefreshServers] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [servers, setServers] = useState<GetServerResponse[]>([]);

  const serverIp = useRef<HTMLInputElement>();
  const serverPassword = useRef<HTMLInputElement>();
  const serverHostname = useRef<HTMLInputElement>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!serverHostname || !serverIp || !serverPassword) return;
    else {
      axios
        .post('/servers', {
          hostname: serverHostname!.current!.value,
          ip: serverIp!.current!.value,
          password: serverPassword!.current!.value,
        })
        .then(() => {
          setRefreshServers(!refreshServers);
          setOpen(false);
        });
    }
  };

  useEffect(() => {
    axios.get<GetServerResponse[]>('/servers').then(({ data }) => {
      setServers(data);
    });
  }, [refreshServers]);

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
          {servers &&
            servers.map(server => (
              <Grid
                item
                key={server.hostname}
                className={classes.serverContainer}
              >
                <Server {...server} />
              </Grid>
            ))}
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <Paper className={classes.paper}>
            <h2 id='simple-modal-title'>Add server</h2>
            <form autoComplete='off' onSubmit={handleSubmit}>
              <Grid
                container
                alignItems='center'
                justify='center'
                direction='column'
                spacing={1}
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
