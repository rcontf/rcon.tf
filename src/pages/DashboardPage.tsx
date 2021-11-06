import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { serverSelector } from '../redux/servers/serverSlice';
import SteamId from 'steamid';
import { useHistory } from 'react-router-dom';

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
  InputBase,
  Collapse,
  Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import SendIcon from '@material-ui/icons/Send';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  PlayerObject,
  ServerDetails,
  getPlayers,
  getServerDetails,
} from '../lib/parsePlayerDetails';

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
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  pre: {
    fontSize: '1.25rem',
    paddingBottom: 30,
  },
}));

interface ServerExecuteResponse {
  body: string;
}

export default function DashboardPage() {
  const classes = useStyles();
  const server = useSelector(serverSelector);
  const history = useHistory();

  const [customCommand, setCustomCommand] = useState('');
  const [customCommandResponse, setCustomCommandResponse] = useState('');

  const [serverError, setServerError] = useState(false);
  const [serverErrorDetails, setServerErrorDetails] = useState('');
  const [serverStats, setServerStats] = useState('');
  const [serverDetails, setServerDetails] = useState<ServerDetails>({
    map: '',
    players: '0/24',
  });
  const [players, setPlayers] = useState<PlayerObject[]>([]);

  if (!server.selected?.hostname) history.push('/servers');

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
          if (er.response.data.message)
            setServerErrorDetails(er.response.data.message);
          setServerError(true);
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
        if (er.response.data.message)
          setServerErrorDetails(er.response.data.message);
        setServerError(true);
      });
  }, [server.selected]);

  const handleCustomCommand = (e: React.FormEvent) => {
    e.preventDefault();

    sendCommand(customCommand)
      .then(res => {
        if (res) setCustomCommandResponse(res.toString());
        else
          setCustomCommandResponse(
            `Successfully executed command ${customCommand}`
          );
      })
      .catch(er => {
        setCustomCommandResponse('Error executing command. (Maybe was sent?)');
      });
  };

  async function removePlayer(id: string, ban: boolean = false) {
    if (ban) {
      await sendCommand(`banid 10 ${id} kick`);
    } else {
      await sendCommand(`kickid ${id}`);
    }
  }

  async function sendCommand(
    command: string,
    showDialog: boolean = false
  ): Promise<string | null> {
    if (showDialog) {
      const doCommand = window.confirm('Really send this command?');
      if (!doCommand) return null;
    }

    const {
      data: { body },
    } = await axios.post<ServerExecuteResponse>('/api/execute', {
      ip: server.selected.ip,
      password: server.selected.password,
      port: server.selected.port,
      command,
    });

    return body;
  }

  return (
    <Layout title='Dashboard | rcon.tf'>
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
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Logs.tf</TableCell>
                    <TableCell align='right'>Connected Time</TableCell>
                    <TableCell align='right'>Ping</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.map(player => (
                    <Player
                      key={player.playerId}
                      player={player}
                      removePlayer={removePlayer}
                    />
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
            Custom command
          </Typography>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            gridGap={10}
          >
            <Paper component='form' className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder='Send Custom Command'
                inputProps={{ 'aria-label': 'Send Custom Command' }}
                onChange={e => setCustomCommand(e.target.value)}
              />
              <IconButton
                onClick={e => handleCustomCommand(e)}
                type='submit'
                className={classes.iconButton}
                aria-label='search'
              >
                <SendIcon />
              </IconButton>
            </Paper>
            {customCommandResponse ? (
              <>
                <Typography align='left' variant='h5'>
                  Response
                </Typography>
                <pre className={classes.pre}>{customCommandResponse}</pre>
              </>
            ) : null}
          </Box>
        </Grid>
      </Container>

      <Snackbar
        open={serverError}
        autoHideDuration={6000}
        onClose={() => setServerError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          elevation={6}
          variant='filled'
          onClose={() => setServerError(false)}
          severity='warning'
        >
          {serverErrorDetails ?? 'Error connecting to server.'}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

interface PlayerProps {
  player: PlayerObject;
  removePlayer: (id: string, ban?: boolean) => Promise<void>;
}

function Player(props: PlayerProps) {
  const { player, removePlayer } = props;
  const [open, setOpen] = useState(false);
  const steamId = useMemo(() => new SteamId(player.id), [player.id]);

  const steamId64 = steamId.getSteamID64();
  const steamId3 = steamId.getSteam3RenderedID();
  const steamId2 = steamId.getSteam2RenderedID();

  return (
    <>
      <TableRow key={player.playerId}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          <Typography variant='body1'>{player.name}</Typography>
        </TableCell>
        <TableCell align='right'>
          <RenderedLink
            href='https://logs.tf/profile/'
            steamId={steamId64}
            type='Logs.tf'
          />
        </TableCell>
        <TableCell align='right'>
          <Typography variant='body1'>{player.connected}</Typography>
        </TableCell>
        <TableCell align='right'>
          <Typography variant='body1'>{player.ping}</Typography>
        </TableCell>
        <TableCell align='center'>
          {' '}
          <Tooltip title='Kick player'>
            <IconButton
              onClick={async () => await removePlayer(player.playerId)}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align='center'>
          {' '}
          <Tooltip title='Ban player'>
            <IconButton
              onClick={async () => await removePlayer(player.playerId, true)}
            >
              <BlockIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Expanded information for {player.name}:
              </Typography>
              <Box display='flex' gridGap={10} style={{ marginBottom: 5 }}>
                <RenderedLink
                  href='http://steamcommunity.com/profiles/'
                  steamId={steamId64}
                  type='Steam'
                />
                <RenderedLink
                  href='https://logs.tf/profile/'
                  steamId={steamId64}
                  type='Logs.tf'
                />
                <RenderedLink
                  href='http://rgl.gg/Public/PlayerProfile.aspx?p='
                  steamId={steamId64}
                  type='RGL'
                />
                <RenderedLink
                  href='http://etf2l.org/search/'
                  steamId={steamId64}
                  type='ETF2L'
                />
                <RenderedLink
                  href='http://www.ugcleague.com/players_page.cfm?player_id='
                  steamId={steamId64}
                  type='UGC'
                />
              </Box>
              <Box display='flex' flexDirection='column'>
                <Typography variant='body1'>ID64: {steamId64}</Typography>
                <Typography variant='body1'>ID3: {steamId3}</Typography>
                <Typography variant='body1'>ID2: {steamId2}</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface RenderedLinkProps {
  steamId: string;
  href: string;
  type: string;
}

function RenderedLink({ steamId, href, type }: RenderedLinkProps) {
  return (
    <Link target='_blank' href={href + steamId} variant='body1'>
      {type}
    </Link>
  );
}
