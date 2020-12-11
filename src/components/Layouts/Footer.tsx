import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    height: '5vh',
    padding: '0 20px',
    bottom: 0,
    backgroundColor: '#2c3e50',
  },
}));

export default function Footer() {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Grid container alignItems='center'>
        <Typography variant='subtitle1'>rcon.tf</Typography>
      </Grid>
    </footer>
  );
}
