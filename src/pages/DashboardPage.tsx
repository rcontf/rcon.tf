import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { serverSelector } from '../redux/servers/serverSlice';
import SteamId from 'steamid';

import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2vh',
  },
  playerContainer: {
    width: '100%',
  },
  table: {
    minWidth: 650,
  },
}));

interface ServerExecuteResponse {
  body: string;
}

interface PlayerObject {
  id: string;
  name: string;
  playerId: string;
  ping: string;
  connected: string;
}

interface ServerDetails {
  map: string;
  players: string;
}

export default function DashboardPage() {
  const classes = useStyles();
  const server = useSelector(serverSelector);

  const [serverError, setServerError] = useState(false);
  const [serverStats, setServerStats] = useState('');
  const [serverDetails, setServerDetails] = useState<ServerDetails>({
    map: '',
    players: '0/24',
  });
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  useEffect(() => {
    if (!serverStats.length) return;
    const updatedDetails = getServerDetails(serverStats);
    setServerDetails(updatedDetails);
  }, [serverStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .post<ServerExecuteResponse>('/api/execute', {
          ip: server.selected.ip,
          password: server.selected.password,
          port: server.selected.port,
          command: 'status',
        })
        .then(({ data }) => {
          setServerStats(data.body.toString());
          setPlayers(getPlayers(data.body.toString()));
        })
        .catch(er => {
          setServerError(true);
          console.log('Cannot reach server.\n' + er);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, [server.selected]);

  useEffect(() => {
    axios
      .post<ServerExecuteResponse>('/api/execute', {
        ip: server.selected.ip,
        password: server.selected.password,
        port: server.selected.port,
        command: 'status',
      })
      .then(({ data }) => {
        setServerStats(data.body.toString());
        setPlayers(getPlayers(data.body.toString()));
      })
      .catch(er => {
        setServerError(true);
        console.log('Cannot reach server.\n' + er);
      });
  }, [server.selected]);

  async function removePlayer(id: string, ban: boolean = false) {
    if (ban) {
      await sendCommand(`banid 10 ${id} kick`);
    } else {
      await sendCommand(`kickid ${id}`);
    }
  }

  async function sendCommand(command: string, showDialog: boolean = false) {
    if (showDialog) {
      const doCommand = window.confirm('Really send this command?');
      if (!doCommand) return;
    }
    await axios.post<ServerExecuteResponse>('/api/execute', {
      ip: server.selected.ip,
      password: server.selected.password,
      port: server.selected.port,
      command,
    });
  }

  return (
    <Layout>
      <Container className={classes.root}>
        <Grid container justify='center' alignItems='center' direction='column'>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
          >
            <Typography variant='h4'>{server.selected.hostname}</Typography>
            <Typography variant='h6'>{serverDetails.map}</Typography>
            <Typography variant='h6'>{serverDetails.players}</Typography>
          </Box>

          <Typography variant='h4' className={classes.root}>
            Players
          </Typography>

          {players.length ? (
            <TableContainer component={Paper} className={classes.root}>
              <Table
                className={classes.table}
                aria-label='list of players'
                size='small'
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Steam ID</TableCell>
                    <TableCell align='right'>Connected Time</TableCell>
                    <TableCell align='right'>Ping</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.map(player => (
                    <TableRow key={player.playerId}>
                      <TableCell component='th' scope='row'>
                        {player.name}
                      </TableCell>
                      <TableCell align='right'>
                        {new SteamId(player.id).getSteamID64()}
                      </TableCell>
                      <TableCell align='right'>{player.connected}</TableCell>
                      <TableCell align='right'>{player.ping}</TableCell>
                      <TableCell align='center'>
                        {' '}
                        <Tooltip title='Kick player'>
                          <IconButton
                            onClick={async () =>
                              await removePlayer(player.playerId)
                            }
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align='center'>
                        {' '}
                        <Tooltip title='Ban player'>
                          <IconButton
                            onClick={async () =>
                              await removePlayer(player.playerId, true)
                            }
                          >
                            <BlockIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant='h6'>No players</Typography>
          )}

          <Typography variant='h4' className={classes.root}>
            Server Controls
          </Typography>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            gridGap={10}
          >
            <Button
              variant='outlined'
              onClick={async () => await sendCommand('_restart', true)}
            >
              Restart Server
            </Button>
            <Button
              variant='outlined'
              onClick={async () => await sendCommand('kickall', true)}
            >
              Kick all
            </Button>
          </Box>
        </Grid>
      </Container>

      <Snackbar
        open={serverError}
        autoHideDuration={6000}
        onClose={() => setServerError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setServerError(false)}
          severity='warning'
        >
          Could not reach server!
        </MuiAlert>
      </Snackbar>
    </Layout>
  );
}

function getPlayers(body: string): PlayerObject[] {
  const playerRegex = body.match(/#.+/g) ?? [];
  const playersAndBots = playerRegex.slice(1);
  const players = playersAndBots.join('\n').match(/.+\[U:\d{1}:\d+].+/g) ?? [];

  if (!players.length) return [];

  return players.map(player => {
    const playerDetailsArrayRaw = player.match(
      /[^\s"']+|"([^"]*)"|'([^']*)'/g
    ) as string[];
    const playerDetails = playerDetailsArrayRaw.map(string =>
      string.replace(/"/g, '')
    );

    return {
      playerId: playerDetails[1],
      name: playerDetails[2],
      id: playerDetails[3],
      connected: playerDetails[4],
      ping: playerDetails[5],
    };
  });
}

function getServerDetails(rawStatus: string): ServerDetails {
  const mapMatch = rawStatus.match(/: (.+) at:/) as string[];
  const maxPlayerMatch = rawStatus.match(/(\d{1,} max\))/) as string[];
  const amountPlayerMatch = rawStatus.match(
    /\d{1,} humans, 1 bots \(\d{1,} max\)/
  ) as string[];

  const map = mapMatch[1];
  const maxPlayers = maxPlayerMatch.join('').split(' ')[0];
  const numberOfPlayers = amountPlayerMatch.join('').split(' ')[0];
  return { map, players: `${numberOfPlayers}/${maxPlayers} players` };
}
