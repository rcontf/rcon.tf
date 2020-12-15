import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.avatar = action.payload.avatar
      state.id = action.payload.id;
    },
  },
});

export const { setUser } = userSlice.actions;

export const getUserDetails = (): AppThunk => dispatch => {
  axios.get<UserData>('/users').then(({ data }) => {
    dispatch(setUser({ avatar: data.avatar, id: data.id }));
  });
};

export const userSelector = (state: RootState) => {
  return state.user;
};

export default userSlice.reducer;
