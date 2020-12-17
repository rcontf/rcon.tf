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
}

interface SetSelectionAction {
  selected: string;
  info: ServerInformation;
}

interface ServerState {
  selected: string;
  info: ServerInformation;
  allServers: GetServerResponse[];
}

const initialState: ServerState = {
  selected: '',
  info: { ip: '', password: '', port: 27015 },
  allServers: [],
};

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<SetSelectionAction>) => {
      state.selected = action.payload.selected;
      state.info = action.payload.info;
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
    //TODO: api response should send the updated UI, so I can just edit that rather than fetching again
    await editUserServer(ip, dto);
    dispatch(fetchServers());
    dispatch(
      setSelection({
        info: dto,
        selected: dto.hostname,
      })
    );
  } catch (err) {
    dispatch(getAllServersFailure(err.toString()));
  }
};

export default serverSlice.reducer;
