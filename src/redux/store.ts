import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import userReducer from './users/userSlice';
import serverSelector from './servers/serverSlice';

export const store = configureStore({
  reducer: {
    // user: userReducer,
    server: serverSelector
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
