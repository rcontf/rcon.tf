import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { Button, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  center: {
    textAlign: 'center',
  },
}));

export default function CustomCommand() {
  const styles = useStyles();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('send a command');
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
        />
        <TextField
          id='server-rcon-password'
          label='Rcon Password'
          style={{ margin: 8 }}
          placeholder='rcon-password-here'
          fullWidth
          margin='normal'
        />
        <TextField
          id='server-command'
          label='Command'
          style={{ margin: 8 }}
          placeholder='status'
          fullWidth
          margin='normal'
        />

        <Button variant='text' type='submit'>
          Send!
        </Button>
      </form>
    </Grid>
  );
}
