import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    height: '80vh',
  },
}));

export default function HomePage() {
  const styles = useStyles();

  return (
    <Layout>
      <Grid
        className={styles.root}
        container
        justify='center'
        alignItems='center'
        direction='column'
      >
        <Typography variant='h3'>rcon.tf</Typography>
        <Typography variant='subtitle1'>
          The platform to manage all your server needs.
        </Typography>
      </Grid>
    </Layout>
  );
}
