import React from 'react';

import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BlockIcon from '@material-ui/icons/Block';

interface PlayerProps {
  id: string;
  name: string;
  playerId: string;
  kick: (id: string) => Promise<void>;
  ban: (id: string, ban: boolean) => Promise<void>;
}

export default function Player(props: PlayerProps) {
  return (
    <Box justifyContent='space-between' alignItems='center'>
      <Typography variant='h6'>{props.name}</Typography>
      <Tooltip title='Kick player'>
        <IconButton onClick={async () => await props.kick(props.playerId)}>
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='Ban player'>
        <IconButton onClick={async () => await props.ban(props.playerId, true)}>
          <BlockIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
