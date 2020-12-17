import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import { RootState } from '../redux/store';
import axios from 'axios';

import { Container, Grid, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2vh',
  },
}));

interface ServerExecuteResponse {
  body: string;
}

interface Player {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const classes = useStyles();
  const server = useSelector((state: RootState) => state.server);

  const [serverStats, setServerStats] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .post<ServerExecuteResponse>('/execute', {
          ip: server.info.ip,
          password: server.info.password,
          port: server.info.port,
          command: 'status',
        })
        .then(({ data }) => {
          setServerStats(data.body.toString());
          setPlayers(getPlayers(serverStats));
        })
        .catch(er => console.log('Cannot reach server.\n' + er));
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [server.info]);

  useEffect(() => {
    axios
      .post<ServerExecuteResponse>('/execute', {
        ip: server.info.ip,
        password: server.info.password,
        port: server.info.port,
        command: 'status',
      })
      .then(({ data }) => {
        setServerStats(data.body.toString());
        setPlayers(getPlayers(data.body.toString()));
      })
      .catch(er => console.log('Cannot reach server.\n' + er));
  }, [server.info]);

  return (
    <Layout>
      <Container className={classes.root}>
        <Grid container justify='center' alignItems='center' direction='column'>
          <Grid item>
            <Typography variant='h4'>{server.selected}</Typography>
            {players.length ? (
              players.map(player => <span key={player.id}>{player.name}</span>)
            ) : (
              <span>No players</span>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

function getPlayers(body: string): Player[] {
  const playerRegex = body.match(/#.+/g) ?? [];
  const playersAndBots = playerRegex.slice(1);
  const players = playersAndBots.join('\n').match(/.+\[U:\d{1}:\d+].+/g) ?? [];

  if (!players.length) return [];

  return players.map(player => {
    const [steamId] = player.match(/\[U:\d{1}:\d+]/g) as string[];
    const [playerName] = player.match(/".+"/g) as string[];
    return {
      id: steamId,
      name: playerName.replace(/"/g, ''),
    };
  });
}
