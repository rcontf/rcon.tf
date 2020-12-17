import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import { RootState } from '../redux/store';
import axios from 'axios';
import Player from '../components/Player';

import { Container, Grid, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2vh',
  },
  playerContainer: {
    width: '100%',
  },
}));

interface ServerExecuteResponse {
  body: string;
}

interface PlayerObject {
  id: string;
  name: string;
  playerId: string;
}

export default function DashboardPage() {
  const classes = useStyles();
  const server = useSelector((state: RootState) => state.server);

  const [serverStats, setServerStats] = useState<string>('');
  const [players, setPlayers] = useState<PlayerObject[]>([]);

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
          setPlayers(getPlayers(data.body.toString()));
        })
        .catch(er => console.log('Cannot reach server.\n' + er));
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  async function removePlayer(id: string, ban: boolean = false) {
    if (ban) {
      await sendCommand(`banid ${id}`);
    } else {
      await sendCommand(`kickid ${id}`);
    }
  }

  async function sendCommand(command: string) {
    await axios.post<ServerExecuteResponse>('/execute', {
      ip: server.info.ip,
      password: server.info.password,
      port: server.info.port,
      command,
    });
  }

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
          <Typography variant='h4'>{server.selected}</Typography>
          <Grid container justify='center' alignItems='center' spacing={2}>
            {players.length ? (
              players.map(player => (
                <Grid item xs={2} key={player.id}>
                  <Player
                    id={player.id}
                    playerId={player.playerId}
                    name={player.name}
                    kick={removePlayer}
                    ban={removePlayer}
                  />
                </Grid>
              ))
            ) : (
              <Grid item>No players</Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

function getPlayers(body: string): PlayerObject[] {
  const playerRegex = body.match(/#.+/g) ?? [];
  const playersAndBots = playerRegex.slice(1);
  const players = playersAndBots.join('\n').match(/.+\[U:\d{1}:\d+].+/g) ?? [];

  if (!players.length) return [];

  return players.map(player => {
    const [steamId] = player.match(/\[U:\d{1}:\d+]/g) as string[];
    const [playerName] = player.match(/".+"/g) as string[];
    const [playerId] = player.match(/\d{1}/) as string[];
    return {
      id: steamId,
      name: playerName.replace(/"/g, ''),
      playerId,
    };
  });
}
