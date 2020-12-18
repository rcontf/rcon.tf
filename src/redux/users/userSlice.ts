import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface UserState {
  avatar: string;
  id: string;
}

interface UserData extends UserState {}

const initialState: UserState = {
  avatar: '',
  id: '',
};

export const loginUser = createAsyncThunk('users/login', async () => {
  const { data } = await axios.get<UserData>('/api/users');
  return { id: data.id, avatar: data.avatar };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.avatar = action.payload.avatar;
      state.id = action.payload.id;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.id = payload.id;
      state.avatar = payload.avatar;
    });
  },
});

export const { setUser } = userSlice.actions;

export const userSelector = (state: RootState) => {
  return state.user;
};

export default userSlice.reducer;
