import React from 'react';
import { GetServerResponse } from '../types/types';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function Server(props: GetServerResponse) {
  return (
    <Box
      alignItems='center'
      display='flex'
      justifyContent='space-between'
      width='100%'
    >
      <Typography variant='h4'>{props.hostname}</Typography>
      <ArrowForwardIosIcon />
    </Box>
  );
}
