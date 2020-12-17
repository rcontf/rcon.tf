import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import { RootState } from '../redux/store';
import axios from 'axios';
import Player from '../components/Player';

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
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { editServer } from '../redux/servers/serverSlice';

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
  const dispatch = useDispatch();
  const server = useSelector((state: RootState) => state.server);
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
    axios
      .delete(`/api/servers/${server.info.ip}`)
      .then(() => {
        history.goBack();
      })
      .catch(er => console.log('Cannot reach server.\n' + er));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serverIp || !serverPassword || !serverPort) return;
    else {
      dispatch(
        editServer(server.info.ip, {
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

  useEffect(() => {
    axios
      .post<ServerExecuteResponse>('/api/execute', {
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

  async function removePlayer(id: string, ban: boolean = false) {
    if (ban) {
      await sendCommand(`banid 0 ${id} kick`);
    } else {
      await sendCommand(`kickid ${id}`);
    }
  }

  async function sendCommand(command: string) {
    await axios.post<ServerExecuteResponse>('/api/execute', {
      ip: server.info.ip,
      password: server.info.password,
      port: server.info.port,
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
            <Typography variant='h4'>{server.selected}</Typography>
          </Box>

          <Typography variant='h4' className={classes.root}>
            Players
          </Typography>
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
              <Grid item>
                <Typography variant='h6' className={classes.root}>
                  No players
                </Typography>
              </Grid>
            )}
          </Grid>
          <Typography variant='h4' className={classes.root}>
            Server Controls
          </Typography>
          <Button
            variant='outlined'
            onClick={async () => await sendCommand('_restart')}
          >
            Restart Server
          </Button>
          <Typography variant='h4' className={classes.root}>
            Settings
          </Typography>
          <Button variant='outlined' onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button variant='outlined' onClick={() => handleOpen()}>
            Edit
          </Button>
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
                defaultValue={server.selected}
              />
              <TextField
                id='server-ip'
                label='Server Ip'
                style={{ margin: 8 }}
                fullWidth
                margin='normal'
                inputRef={serverIp}
                defaultValue={server.info.ip}
              />
              <TextField
                id='server-rcon-password'
                label='Rcon Password'
                style={{ margin: 8 }}
                fullWidth
                margin='normal'
                inputRef={serverPassword}
                defaultValue={server.info.password}
              />
              <TextField
                id='server-rcon-port'
                label='Port'
                style={{ margin: 8 }}
                fullWidth
                type='number'
                margin='normal'
                inputRef={serverPort}
                defaultValue={server.info.port}
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
    const [steamId] = player.match(/\[U:\d{1}:\d+]/g) as string[];
    const [playerName] = player.match(/".+"/g) as string[];
    const [playerId] = player.match(/\d+/) as string[];
    return {
      id: steamId,
      name: playerName.replace(/"/g, ''),
      playerId,
    };
  });
}
