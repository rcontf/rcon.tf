import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import { RootState } from '../redux/store';

import { Container, Grid, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2vh',
  },
}));

export default function DashboardPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const server = useSelector((state: RootState) => state.server);

  return (
    <Layout>
      <Container className={classes.root}>
        <Grid container justify='center' alignItems='center' direction='column'>
          <Grid item>
            <Typography variant='h4'>{server.selected}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
