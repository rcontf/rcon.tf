import React, { useEffect, useMemo, useState } from 'react';
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
  InputBase,
  Collapse,
  Link,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import SendIcon from '@material-ui/icons/Send';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import LinkIcon from '@material-ui/icons/Link';
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

  const [customCommand, setCustomCommand] = useState('');
  const [customCommandResponse, setCustomCommandResponse] = useState('');

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

  const handleCustomCommand = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      ip: server.selected.ip,
      password: server.selected.password,
      port: server.selected.port,
      command: customCommand,
    });

    axios
      .post<ServerExecuteResponse>('/api/execute', {
        ip: server.selected.ip,
        password: server.selected.password,
        port: server.selected.port,
        command: customCommand,
      })
      .then(({ data }) => {
        if (data) setCustomCommandResponse(data.body.toString());
        else
          setCustomCommandResponse(
            `Successfully executed command ${customCommand}`
          );
      })
      .catch(er => {
        setCustomCommandResponse('');
      });
  };

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
                    <TableCell />
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
    /\d{1,} humans, \d{1,} bots \(\d{1,} max\)/
  ) as string[];

  const map = mapMatch[1];
  const maxPlayers = maxPlayerMatch.join('').split(' ')[0];
  const numberOfPlayers = amountPlayerMatch.join('').split(' ')[0];
  return { map, players: `${numberOfPlayers}/${maxPlayers} players` };
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
          {player.name}
        </TableCell>
        <TableCell align='right'>{steamId64}</TableCell>
        <TableCell align='right'>{player.connected}</TableCell>
        <TableCell align='right'>{player.ping}</TableCell>
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
