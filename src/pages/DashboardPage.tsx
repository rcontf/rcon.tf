import React, { useState, useEffect, FormEvent } from 'react';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { GetServerResponse } from '../types/types';

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
}));

export default function DashboardPage() {
  const classes = useStyles();

  const [open, setOpen] = useState<boolean>(false);
  const [servers, setServers] = useState<GetServerResponse[]>([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('submitted');
  };

  useEffect(() => {
    axios.get<GetServerResponse[]>('/servers').then(({ data }) => {
      setServers(data);
    });
  }, []);

  return (
    <Layout>
      <Container className={classes.root}>
        <Grid
          container
          justify='center'
          alignItems='center'
          direction='column'
          spacing={3}
        >
          <Typography variant='h4'>Select a Server</Typography>
          <Button variant='outlined' onClick={handleOpen}>
            Add
          </Button>
          {servers &&
            servers.map(server => (
              <Grid item key={server.hostname}>
                {server.hostname}
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
                />
                <TextField id='server-ip' label='IP' fullWidth required />
                <TextField
                  id='server-password'
                  label='Rcon Password'
                  fullWidth
                  required
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
