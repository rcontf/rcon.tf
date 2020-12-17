import React from 'react';
import { GetServerResponse } from '../types/types';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch } from 'react-redux';
import { setServer } from '../redux/servers/serverSlice';
import { useHistory } from 'react-router-dom';

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
      <Typography variant='h4'>{props.hostname}</Typography>
      <IconButton>
        <ArrowForwardIosIcon
          onClick={() => {
            dispatch(
              setServer({
                selected: props.hostname,
                info: {
                  ip: props.ip,
                  password: props.password,
                  port: props.port,
                },
              })
            );
            history.push('/dashboard');
          }}
        />
      </IconButton>
    </Box>
  );
}
