import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: ServerState = {
  selected: '',
  info: { ip: '', password: '', port: 27015 },
};

interface ServerInformation {
  ip: string;
  password: string;
  port: number;
}

interface SetServerAction {
  selected: string;
  info: ServerInformation;
}

interface ServerState {
  selected: string;
  info: ServerInformation;
}

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServer: (state, action: PayloadAction<SetServerAction>) => {
      state.selected = action.payload.selected;
      state.info = action.payload.info;
    },
    getServer: state => {
      //TODO: redux get server information
    },
  },
});

export const { setServer } = serverSlice.actions;

export const serverReducer = (state: RootState) => {
  return state.server;
};

export default serverSlice.reducer;
