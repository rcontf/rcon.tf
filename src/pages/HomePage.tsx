import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid/Grid';

import Layout from '../components/Layouts/Layout';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CustomCommand from '../components/CustomCommand';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
  },
  featurette: {
    height: '100vh',
  },
  featuretteText: {
    textAlign: 'center',
    width: '50%',
  },
  text: {
    textAlign: 'center',
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
        <Typography variant='h4' className={styles.text}>
          The platform to manage all your server needs.
        </Typography>
      </Grid>

      <Grid
        className={styles.featurette}
        container
        justify='center'
        alignItems='center'
        direction='column'
      >
        <Typography variant='h3'>What is rcon.tf?</Typography>
        <Typography variant='h5' className={styles.featuretteText}>
          rcon.tf is the platform for controlling your server. You can execute
          custom commands, do management of your server, or just see what's
          going on with the best tooling to help you manage your server.
        </Typography>
      </Grid>

      <Grid
        className={styles.featurette}
        container
        justify='center'
        alignItems='center'
        direction='column'
      >
        <CustomCommand />
      </Grid>
    </Layout>
  );
}
