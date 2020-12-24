import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import {
  AddServerDto,
  EditServerDto,
  GetServerResponse,
} from '../../types/types';
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
}

const initialState: ServerState = {
  selected: { ip: '', password: '', port: 27015, hostname: '' },
  allServers: [],
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
    getAllServersSuccess: (
      state,
      action: PayloadAction<GetServerResponse[]>
    ) => {
      state.allServers = action.payload;
    },
    getAllServersFailure: (state, action: PayloadAction<string>) => {
      state.allServers = [];
    },
  },
});

export const {
  setSelection,
  addServerSuccess,
  getAllServersSuccess,
  getAllServersFailure,
} = serverSlice.actions;

export const serverReducer = (state: RootState) => {
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
    if (!newServer) return;
    dispatch(addServerSuccess(newServer));
  } catch (err) {
    dispatch(getAllServersFailure(err.toString()));
  }
};

export const deleteServer = (ip: string): AppThunk => async dispatch => {
  try {
    await deleteUserServer(ip);
    dispatch(fetchServers());
  } catch (err) {
    dispatch(getAllServersFailure(err.toString()));
  }
};

export const editServer = (
  ip: string,
  dto: EditServerDto
): AppThunk => async dispatch => {
  try {
    dispatch(setSelection(dto));
    await editUserServer(ip, dto);
    dispatch(fetchServers());
  } catch (err) {
    dispatch(getAllServersFailure(err.toString()));
  }
};

export default serverSlice.reducer;
