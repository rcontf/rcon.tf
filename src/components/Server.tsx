import React from 'react';
import { GetServerResponse } from '../redux/servers/types';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch } from 'react-redux';
import { setSelection } from '../redux/servers/serverSlice';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';

export default function Server(props: GetServerResponse) {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Box
      alignItems='center'
      display='flex'
      justifyContent='space-between'
      width='100%'
    >
      <Tooltip title={`IP: ${props.ip}`} interactive>
        <Typography variant='h4'>{props.hostname}</Typography>
      </Tooltip>
      <IconButton
        onClick={() => {
          dispatch(
            setSelection({
              hostname: props.hostname,
              ip: props.ip,
              password: props.password,
              port: props.port,
            })
          );
          history.push('/dashboard');
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
