import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import useUser from '../contexts/UserContext';
import { EditServerDto, GetServerResponse } from '../redux/servers/types';
import { useFormik } from 'formik';
import {
  deleteServer,
  editServer,
  fetchServers,
  serverSelector,
} from '../redux/servers/serverSlice';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Avatar,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(4),
    },
  },
  avatar: {
    height: 125,
    width: 125,
    [theme.breakpoints.down('sm')]: {
      height: 75,
      width: 75,
    },
  },
  table: {
    minWidth: '35vw',
  },
  username: {
    marginLeft: theme.spacing(2),
  },
}));

export default function ProfilePage() {
  const currentUser = useUser();
  const user = currentUser!.user!;

  const classes = useStyles();
  const dispatch = useDispatch();
  const servers = useSelector(serverSelector);

  const [deleteServerOpen, setDeleteServerOpen] = useState(false);
  const [editServerOpen, setEditServerOpen] = useState(false);

  const [editServerDetails, setEditServerDetails] = useState<GetServerResponse>(
    {
      hostname: '',
      ip: '',
      logs: [],
      owner: '',
      password: '',
      port: 27015,
      type: '',
    }
  );

  const formik = useFormik({
    initialValues: {
      hostname: editServerDetails.hostname,
      ip: editServerDetails.ip,
      password: editServerDetails.password,
      port: editServerDetails.port,
    },
    enableReinitialize: true,
    onSubmit: values => handleEditServer(editServerDetails.ip, values),
  });

  const handleDeleteServer = (ip: string) => {
    dispatch(deleteServer(ip));
    setDeleteServerOpen(false);
  };

  const handleEditServer = (ip: string, server: EditServerDto) => {
    dispatch(editServer(ip, server));
    setEditServerOpen(false);
  };

  const handleEditServerOpen = (server: GetServerResponse) => {
    setEditServerDetails(server);
    setEditServerOpen(true);
  };

  const handleDeleteServerOpen = (server: GetServerResponse) => {
    setEditServerDetails(server);
    setDeleteServerOpen(true);
  };

  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);

  return (
    <Layout>
      <Container className={classes.root}>
        <Box display='flex' alignItems='center'>
          <Avatar
            alt="user's profile picture"
            src={user.avatar}
            className={classes.avatar}
          />
          <Typography variant='h4' className={classes.username}>
            {user.name}
          </Typography>
        </Box>

        <Typography variant='h4'>
          Your Saved Servers
        </Typography>
        <Box display='flex' justifyContent='center' alignItems='center'>
          {servers.loadingAllServers && <CircularProgress size={50} />}

          {!servers.loadingAllServers && !servers.allServers.length && (
            <Typography variant='h5'>No saved servers!</Typography>
          )}

          {!servers.loadingAllServers &&
            !servers.allServersError &&
            !!servers.allServers.length && (
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='list of players'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Alias</TableCell>
                      <TableCell align='center'>Edit</TableCell>
                      <TableCell align='center'>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servers.allServers.map(server => (
                      <TableRow key={server.ip}>
                        <TableCell component='th' scope='row'>
                          {server.hostname}
                        </TableCell>
                        <TableCell align='center'>
                          <Tooltip title='Edit Details'>
                            <IconButton
                              onClick={() => handleEditServerOpen(server)}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align='center'>
                          <Tooltip title='Remove Server'>
                            <IconButton
                              onClick={() => handleDeleteServerOpen(server)}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Box>
      </Container>

      <Dialog
        open={deleteServerOpen}
        onClose={() => setDeleteServerOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Delete this server?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deleting this server means that you will have to re-add it in the
            future if you wish to use this platform again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteServerOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteServer(editServerDetails.ip)}
            color='primary'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={editServerOpen}
        onClose={() => setEditServerOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Edit this server</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id='alert-dialog-description'>
            Here you may edit your server details.
          </DialogContentText>
          <form id='edit-server-form' onSubmit={formik.handleSubmit}>
            <Box display='flex' gridGap={15} flexDirection='column'>
              <TextField
                id='hostname'
                name='hostname'
                label='Alias'
                helperText='What do you want to call the server?'
                fullWidth
                required
                value={formik.values.hostname}
                onChange={formik.handleChange}
                error={
                  formik.touched.hostname && Boolean(formik.errors.hostname)
                }
              />
              <TextField
                id='ip'
                name='ip'
                label='IP'
                fullWidth
                required
                value={formik.values.ip}
                onChange={formik.handleChange}
                error={formik.touched.ip && Boolean(formik.errors.ip)}
              />
              <TextField
                id='password'
                label='Rcon Password'
                name='password'
                fullWidth
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              />
              <TextField
                id='port'
                name='port'
                label='Server port'
                fullWidth
                type='number'
                value={formik.values.port}
                onChange={formik.handleChange}
                error={formik.touched.port && Boolean(formik.errors.port)}
              />
            </Box>
          </form>
          <DialogActions>
            <Button onClick={() => setEditServerOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button
              color='primary'
              autoFocus
              type='submit'
              form='edit-server-form'
            >
              Edit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
