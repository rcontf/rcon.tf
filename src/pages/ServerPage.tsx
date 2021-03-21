import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import Server from '../components/Server';
import { useDispatch, useSelector } from 'react-redux';
import {
  addServer,
  fetchServers,
  serverSelector,
} from '../redux/servers/serverSlice';
import { useFormik } from 'formik';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: '5vh',
  },
  serverContainer: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  formInputs: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    '& > *:first-child': {
      marginTop: 0,
    },
  },
}));

export default function ServerPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const servers = useSelector(serverSelector);

  const [addServerOpen, setAddServerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      hostname: '',
      ip: '',
      password: '',
      port: 27015,
    },
    validate: values => {
      const userHasServerIp = servers.allServers.some(
        server => server.ip === values.ip
      );

      if (userHasServerIp) {
        formik.setFieldError('ip', 'You already have a server with that IP.');
        return { error: 'You already have a server with that IP.' };
      }
    },
    onSubmit: values => {
      dispatch(
        addServer({
          hostname: values.hostname,
          ip: values.ip,
          password: values.password,
          port: values.port,
        })
      );
    },
  });

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

          {servers.allServersError && (
            <Typography variant='h4'>
              Problem loading your servers :(
            </Typography>
          )}

          {!servers.loadingAllServers && !servers.allServers.length && (
            <Typography variant='h4'>You have no saved servers!</Typography>
          )}

          {servers.loadingAllServers && (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              height='20vh'
            >
              <CircularProgress size={50} />
            </Box>
          )}

          {!servers.loadingAllServers &&
            !servers.allServersError &&
            servers.allServers.length > 0 &&
            servers.allServers.map(server => (
              <Grid
                item
                key={server.hostname}
                className={classes.serverContainer}
              >
                <Server {...server} />
              </Grid>
            ))}
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
              Save your server for easy access and management.
            </DialogContentText>

            <form
              autoComplete='off'
              id='add-server-form'
              onSubmit={formik.handleSubmit}
              className={classes.formInputs}
            >
              <TextField
                id='hostname'
                name='hostname'
                label='Alias'
                helperText='What do you want to call the server?'
                fullWidth
                required
                value={formik.values.hostname}
                onChange={formik.handleChange}
              />
              <TextField
                id='ip'
                name='ip'
                label='IP'
                fullWidth
                required
                value={formik.values.ip}
                onChange={formik.handleChange}
                error={formik.touched.ip && Boolean(formik.errors.ip)}
                helperText={formik.touched.ip && formik.errors.ip}
              />
              <TextField
                id='password'
                name='password'
                label='Rcon Password'
                fullWidth
                required
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <TextField
                id='port'
                name='port'
                label='Server port'
                fullWidth
                type='number'
                value={formik.values.port}
                onChange={e => formik.handleChange}
                helperText='Default value for Source games are usually 27015'
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddServerOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              form='add-server-form'
              color='primary'
              autoFocus
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
