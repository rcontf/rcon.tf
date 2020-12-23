import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface UserState {
  avatar: string;
  id: string;
  name: string;
}

interface UserData extends UserState {}

const initialState: UserState = {
  avatar: '',
  id: '',
  name: '',
};

export const loginUser = createAsyncThunk('users/login', async () => {
  const { data } = await axios.get<UserData>('/api/users');
  return { id: data.id, avatar: data.avatar, name: data.name };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.avatar = action.payload.avatar;
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.id = payload.id;
      state.avatar = payload.avatar;
      state.name = payload.name;
    });
  },
});

export const { setUser } = userSlice.actions;

export const userSelector = (state: RootState) => {
  return state.user;
};

export default userSlice.reducer;
