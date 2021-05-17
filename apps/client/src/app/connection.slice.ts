import { AnyAction, ThunkAction, createSlice } from '@reduxjs/toolkit';

import { startHerbie, stopHerbie } from './controls.slice';
import { closeSnackbar, enqueueSnackbar, notificationsSelectors } from './notifications.slice';
import { RootState } from './store';

const name = 'herbie/connection';

type State = {
  connected: boolean;
  error: boolean;
};

export const initialState: State = {
  connected: false,
  error: null
};

export const setConnection = (payload: boolean): ThunkAction<boolean, RootState, null, AnyAction> => (
  dispatch,
  getState
) => {
  dispatch(actions.setConnection(payload));

  if (payload) {
    dispatch(enqueueSnackbar({ message: 'Connected to controls server.', options: { variant: 'success' } }));

    const message = 'Error with controls server.';
    const errorNotification = notificationsSelectors
      .selectAll(getState() as RootState)
      .find((notification) => notification.message === message);

    if (errorNotification) {
      dispatch(closeSnackbar(errorNotification.id));
    }
  } else {
    dispatch(stopHerbie());
  }

  return payload;
};

export const setError = (payload: boolean): ThunkAction<boolean, RootState, null, AnyAction> => (
  dispatch,
  getState
) => {
  dispatch(actions.setError(payload));

  const message = 'Error with controls server.';
  const errorNotification = notificationsSelectors
    .selectAll(getState() as RootState)
    .find((notification) => notification.message === message);

  if (!errorNotification) {
    dispatch(enqueueSnackbar({ message, options: { variant: 'error', persist: true } }));
  }

  return payload;
};

const connection = createSlice({
  name,
  initialState,
  reducers: {
    setConnection(state, action) {
      if (action.payload) {
        state.error = null;
      }

      state.connected = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(startHerbie, (state) => {
      state.error = null;
    });
  }
});

export const { actions, reducer: connectionReducer } = connection;
