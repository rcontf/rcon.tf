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
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import axios from 'axios';
import { useFormik } from 'formik';

const useStyles = makeStyles(theme => ({
  center: {
    textAlign: 'center',
  },
}));

export default function CustomCommand() {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      ip: '',
      password: '',
      port: 27015,
      command: '',
    },
    enableReinitialize: true,
    onSubmit: values => {
      console.log(values);
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
        });
    },
  });

  return (
    <Grid container justify='center' alignItems='center' direction='column'>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant='h5' className={styles.center}>
          Try it out!
        </Typography>

        <TextField
          id='server-ip'
          label='Server Ip'
          style={{ margin: 8 }}
          placeholder='mge.elo.associates'
          fullWidth
          margin='normal'
          required
          value={formik.values.ip}
          onChange={e => formik.setFieldValue('ip', e.target.value)}
          error={formik.touched.ip && Boolean(formik.errors.ip)}
        />
        <TextField
          id='server-rcon-password'
          label='Rcon Password'
          style={{ margin: 8 }}
          placeholder='rcon-password-here'
          fullWidth
          margin='normal'
          required
          value={formik.values.password}
          onChange={e => formik.setFieldValue('password', e.target.value)}
          error={formik.touched.password && Boolean(formik.errors.password)}
        />
        <TextField
          id='server-rcon-port'
          label='Port'
          style={{ margin: 8 }}
          placeholder='27015'
          fullWidth
          type='number'
          defaultValue={27015}
          margin='normal'
          value={formik.values.port}
          onChange={e => formik.setFieldValue('port', parseInt(e.target.value))}
          error={formik.touched.port && Boolean(formik.errors.port)}
        />
        <TextField
          id='server-command'
          label='Command'
          style={{ margin: 8 }}
          placeholder='status'
          fullWidth
          margin='normal'
          required
          value={formik.values.command}
          onChange={e => formik.setFieldValue('command', e.target.value)}
          error={formik.touched.command && Boolean(formik.errors.command)}
        />

        <Button variant='outlined' type='submit'>
          Send!
        </Button>
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
    </Grid>
  );
}
