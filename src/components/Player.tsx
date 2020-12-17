import React, { useMemo } from 'react';

import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SteamId from 'steamid';

interface PlayerProps {
  id: string;
  name: string;
  playerId: string;
  kick: (id: string) => Promise<void>;
  ban: (id: string, ban: boolean) => Promise<void>;
}

const useStyles = makeStyles(theme => ({
  text: {
    marginRight: 25,
  },
}));

export default function Player(props: PlayerProps) {
  const classes = useStyles();

  const sid = useMemo(() => new SteamId(props.id), []);

  return (
    <Box justifyContent='space-between' alignItems='center' width='100%'>
      <Tooltip title={sid.getSteamID64()} interactive>
        <Typography variant='h6' display='inline'>
          {props.name}
        </Typography>
      </Tooltip>
      <span className={classes.text}>
        <Tooltip title='Kick player'>
          <IconButton onClick={async () => await props.kick(props.playerId)}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Ban player'>
          <IconButton
            onClick={async () => await props.ban(props.playerId, true)}
          >
            <BlockIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </span>
    </Box>
  );
}
