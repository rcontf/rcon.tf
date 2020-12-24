import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  deleteServer,
  editServer,
  serverSelector,
} from '../redux/servers/serverSlice';
import SteamId from 'steamid';

import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2vh',
  },
  playerContainer: {
    width: '100%',
  },
  modal: {
    position: 'absolute',
    width: 600,
    height: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 0,
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

export default function DashboardPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const server = useSelector(serverSelector);
  const history = useHistory();

  const [, setServerStats] = useState<string>('');
  const [players, setPlayers] = useState<PlayerObject[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const serverIp = useRef<HTMLInputElement>();
  const serverPassword = useRef<HTMLInputElement>();
  const serverPort = useRef<HTMLInputElement>();
  const serverHostname = useRef<HTMLInputElement>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const wantToDelete = window.confirm('Do you want to delete this server?');

    if (!wantToDelete) return;
    dispatch(deleteServer(server.selected.ip));
    history.goBack();
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serverIp || !serverPassword || !serverPort) return;
    else {
      dispatch(
        editServer(server.selected.ip, {
          hostname: serverHostname!.current!.value,
          ip: serverIp!.current!.value,
          password: serverPassword!.current!.value,
          port: parseInt(serverPort!.current!.value),
        })
      );
    }
  }

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
        .catch(er => console.log('Cannot reach server.\n' + er));
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
      .catch(er => console.log('Cannot reach server.\n' + er));
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
          <Box display='flex' justifyContent='center' alignItems='center'>
            <IconButton onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h4'>{server.selected.hostname}</Typography>
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

          <Typography variant='h4' className={classes.root}>
            Settings
          </Typography>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            gridGap={10}
          >
            <Button variant='outlined' onClick={() => handleDelete()}>
              Delete
            </Button>
            <Button variant='outlined' onClick={() => handleOpen()}>
              Edit
            </Button>
          </Box>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='edit-title'
          aria-describedby='edit-description'
        >
          <Paper className={classes.modal}>
            <h2 id='edit-title'>Edit</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                id='server-hostname'
                label='Hostname'
                style={{ margin: 8 }}
                fullWidth
                margin='normal'
                inputRef={serverHostname}
                defaultValue={server.selected.hostname}
              />
              <TextField
                id='server-ip'
                label='Server Ip'
                style={{ margin: 8 }}
                fullWidth
                margin='normal'
                inputRef={serverIp}
                defaultValue={server.selected.ip}
              />
              <TextField
                id='server-rcon-password'
                label='Rcon Password'
                style={{ margin: 8 }}
                fullWidth
                margin='normal'
                inputRef={serverPassword}
                defaultValue={server.selected.password}
              />
              <TextField
                id='server-rcon-port'
                label='Port'
                style={{ margin: 8 }}
                fullWidth
                type='number'
                margin='normal'
                inputRef={serverPort}
                defaultValue={server.selected.port}
              />

              <Button variant='text' type='submit'>
                Edit
              </Button>
              <Button variant='text' type='reset'>
                Reset
              </Button>
            </form>
          </Paper>
        </Modal>
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
    const playerDetailsArrayRaw = player.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) as string[];
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
