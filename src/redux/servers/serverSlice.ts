import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { AddServerDto, EditServerDto, GetServerResponse } from './types';
import {
  getUserServers,
  addUserServer,
  deleteUserServer,
  editUserServer,
} from './serverApi';

interface ServerInformation {
  ip: string;
  password: string;
  port: number;
  hostname: string;
}

interface ServerState {
  selected: ServerInformation;
  allServers: GetServerResponse[];
  allServersError: string;
  loadingAllServers: boolean;
}

const initialState: ServerState = {
  selected: { ip: '', password: '', port: 27015, hostname: '' },
  allServers: [],
  allServersError: '',
  loadingAllServers: true,
};

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<ServerInformation>) => {
      state.selected = action.payload;
    },
    addServerSuccess: (state, action: PayloadAction<GetServerResponse>) => {
      state.allServers.push(action.payload);
    },
    editServerSuccess: (state, action: PayloadAction<GetServerResponse>) => {
      const serverIndex = state.allServers.findIndex(
        server => server.ip === action.payload.ip
      );
      state.allServers[serverIndex] = action.payload;
    },
    deleteServerSuccess: (state, action: PayloadAction<string>) => {
      const filteredServers = state.allServers.filter(
        server => server.ip !== action.payload
      );
      state.allServers = filteredServers;
    },
    getAllServersSuccess: (
      state,
      action: PayloadAction<GetServerResponse[]>
    ) => {
      state.allServers = action.payload;
      state.loadingAllServers = false;
    },
    getAllServersFailure: (state, action: PayloadAction<string>) => {
      state.allServers = [];
      state.allServersError = action.payload || "Error retreiving data";
      state.loadingAllServers = false;
    },
  },
});

export const {
  setSelection,
  addServerSuccess,
  getAllServersSuccess,
  getAllServersFailure,
  editServerSuccess,
  deleteServerSuccess,
} = serverSlice.actions;

export const serverSelector = (state: RootState) => {
  return state.server;
};

export const fetchServers = (): AppThunk => async dispatch => {
  try {
    const allServers = await getUserServers();
    dispatch(getAllServersSuccess(allServers));
  } catch (err) {
    dispatch(getAllServersFailure(err.toString()));
  }
};

export const addServer = (dto: AddServerDto): AppThunk => async dispatch => {
  try {
    const newServer = await addUserServer(dto);
    dispatch(addServerSuccess(newServer));
  } catch (err) {
    console.warn(err.toString());
  }
};

export const deleteServer = (ip: string): AppThunk => async dispatch => {
  try {
    dispatch(deleteServerSuccess(ip));
    await deleteUserServer(ip);
  } catch (err) {
    console.warn(err.toString());
  }
};

export const editServer = (
  ip: string,
  dto: EditServerDto
): AppThunk => async dispatch => {
  try {
    const server = await editUserServer(ip, dto);
    dispatch(editServerSuccess(server));
  } catch (err) {
    console.warn(err.toString());
  }
};

export default serverSlice.reducer;
