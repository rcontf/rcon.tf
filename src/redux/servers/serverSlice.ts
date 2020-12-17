import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import axios from 'axios';

interface ServerState {
  selected: string;
}

const initialState: ServerState = {
  selected: '',
};

interface SetServerAction {
  selected: string;
}

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServer: (state, action: PayloadAction<SetServerAction>) => {
      state.selected = action.payload.selected;
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
