import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

import { UserData } from './types';
import { getUserInfo } from './userApi';

interface UserState {
  avatar: string;
  id: string;
  name: string;
}

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
    },
    setUserFailure: state => {
    },
  },
});

export const { setUserSuccess, setUserFailure } = userSlice.actions;

// export const userSelector = (state: RootState) => {
//   return state.user;
// };


export default userSlice.reducer;
