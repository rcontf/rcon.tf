import React, { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { GetServerResponse } from '../types/types';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '5vh',
  },
}));

export default function DashboardPage() {
  const classes = useStyles();

  const [servers, setServers] = useState<GetServerResponse[]>([]);

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
          <Button variant="outlined">
              Add
          </Button>
          {servers && servers.map(server => <Grid item>{server.hostname}</Grid>)}
        </Grid>
      </Container>
    </Layout>
  );
}
