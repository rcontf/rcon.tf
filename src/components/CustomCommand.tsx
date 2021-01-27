import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import axios from 'axios';
import { useFormik } from 'formik';

const useStyles = makeStyles(theme => ({
  center: {
    textAlign: 'center',
  },
  spacing: {
    '& >*': {
      marginBottom: 10,
    },
  },
}));

export default function CustomCommand() {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [serverError, setServerError] = useState<boolean>(false);
  const [badResponse, setBadResponse] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      ip: '',
      password: '',
      port: 27015,
      command: '',
    },
    onSubmit: values => {
      axios
        .post('/api/execute', {
          ip: values.ip,
          password: values.password,
          port: values.port,
          command: values.command,
        })
        .then(({ data }) => {
          setResponse(data.body);
          setOpen(true);
        })
        .catch(e => {
          if (e.response.data.message) setBadResponse(e.response.data.message);
          else setBadResponse(e.response.data.error);
          setServerError(true);
        });
    },
  });

  return (
    <Grid container justify='center' alignItems='center' direction='column'>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant='h5' className={styles.center}>
          Try it out!
        </Typography>

        <div className={styles.spacing}>
          <TextField
            id='ip'
            label='Server Ip'
            placeholder='mge.elo.associates'
            fullWidth
            required
            value={formik.values.ip}
            onChange={formik.handleChange}
            error={formik.touched.ip && Boolean(formik.errors.ip)}
          />
          <TextField
            id='password'
            label='Rcon Password'
            placeholder='rcon-password-here'
            fullWidth
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
          />
          <TextField
            id='port'
            label='Port'
            placeholder='27015'
            fullWidth
            margin='normal'
            value={formik.values.port}
            onChange={formik.handleChange}
            error={formik.touched.port && Boolean(formik.errors.port)}
          />
          <TextField
            id='command'
            label='Command'
            placeholder='status'
            fullWidth
            required
            value={formik.values.command}
            onChange={formik.handleChange}
            error={formik.touched.command && Boolean(formik.errors.command)}
          />
          <Button variant='outlined' type='submit'>
            Send!
          </Button>
        </div>
      </form>

      <Dialog
        maxWidth='lg'
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='rcon-response-dialog'
        aria-describedby='rcon-response-dialog'
      >
        <DialogTitle id='rcon-response-dialog-title'>
          Server's Response
        </DialogTitle>
        <DialogContent>
          <pre>{response}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={serverError}
        autoHideDuration={5000}
        onClose={() => setServerError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          elevation={6}
          variant='filled'
          onClose={() => setServerError(false)}
          severity='warning'
        >
          {badResponse ?? 'Error sending response'}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
