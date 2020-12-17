import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from './users/userSlice';
import serverReducer from './servers/serverSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    server: serverReducer
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
