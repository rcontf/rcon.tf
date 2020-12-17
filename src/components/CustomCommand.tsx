import React, { useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { Button, Grid, Typography, Paper, Modal } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  center: {
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    width: 800,
    height: 800,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'left',
  },
}));

export default function CustomCommand() {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');

  const serverIp = useRef<HTMLInputElement>();
  const serverPassword = useRef<HTMLInputElement>();
  const serverPort = useRef<HTMLInputElement>();
  const serverCommand = useRef<HTMLInputElement>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serverCommand || !serverIp || !serverPassword || !serverPort) return;
    else {
      axios
        .post('/execute', {
          ip: serverIp!.current!.value,
          password: serverPassword!.current!.value,
          port: parseInt(serverPort!.current!.value) ?? 27015,
          command: serverCommand!.current!.value,
        })
        .then(({ data }) => {
          setResponse(data.body);
          handleOpen();
        });
    }
  }

  return (
    <Grid container justify='center' alignItems='center' direction='column'>
      <form onSubmit={handleSubmit}>
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
          inputRef={serverIp}
          required
        />
        <TextField
          id='server-rcon-password'
          label='Rcon Password'
          style={{ margin: 8 }}
          placeholder='rcon-password-here'
          fullWidth
          margin='normal'
          required
          inputRef={serverPassword}
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
          inputRef={serverPort}
        />
        <TextField
          id='server-command'
          label='Command'
          style={{ margin: 8 }}
          placeholder='status'
          fullWidth
          margin='normal'
          required
          inputRef={serverCommand}
        />

        <Button variant='text' type='submit'>
          Send!
        </Button>
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        <Paper className={styles.modal}>
          <h2 id='simple-modal-title'>Response</h2>
          <pre>{response}</pre>
        </Paper>
      </Modal>
    </Grid>
  );
}
