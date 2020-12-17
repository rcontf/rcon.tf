import React from 'react';
import { GetServerResponse } from '../types/types';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch } from 'react-redux';
import { setServer } from '../redux/servers/serverSlice';

export default function Server(props: GetServerResponse) {
  const dispatch = useDispatch();

  return (
    <Box
      alignItems='center'
      display='flex'
      justifyContent='space-between'
      width='100%'
    >
      <Typography variant='h4'>{props.hostname}</Typography>
      <IconButton>
        <ArrowForwardIosIcon
          onClick={() => dispatch(setServer({ selected: props.ip }))}
        />
      </IconButton>
    </Box>
  );
}
