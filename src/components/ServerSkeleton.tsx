import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';

export default function Server() {
  return (
    <Box
      alignItems='center'
      display='flex'
      justifyContent='space-between'
      width='50%'
    >
      <Typography variant='h4'>
        <Skeleton width={200} height={72} />
      </Typography>
      <Skeleton width={50} height={72}/>
    </Box>
  );
}
