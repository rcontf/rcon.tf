import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import { getUserInfo } from './userApi';

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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSuccess: (state, action: PayloadAction<UserData>) => {
      state.avatar = action.payload.avatar;
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    setUserFailure: state => {
      state.avatar = '';
      state.id = '';
      state.name = '';
    },
  },
});

export const { setUserSuccess, setUserFailure } = userSlice.actions;

export const userSelector = (state: RootState) => {
  return state.user;
};

export const fetchUser = (): AppThunk => async dispatch => {
  try {
    const user = await getUserInfo();
    dispatch(setUserSuccess(user));
  } catch (err) {
    dispatch(setUserFailure());
  }
};

export default userSlice.reducer;
