import { Message } from '@herbie/types';
import { createSlice } from '@reduxjs/toolkit';

import { AppThunkAction } from '../app/store';
import { hasNotification } from '../common/helpers/has-notification';
import { startHerbie } from './controls';
import { closeSnackbar, enqueueSnackbar } from './notifications';

const name = 'herbie/connection';

type State = {
  connected: boolean;
  error: boolean | string | null;
};

export const initialState: State = {
  connected: false,
  error: null
};

export const setConnection = (payload: boolean): AppThunkAction<boolean> => (dispatch, getState) => {
  dispatch(actions.setConnection(payload));

  if (payload) {
    dispatch(enqueueSnackbar({ message: Message.SuccessControl, options: { variant: 'success' } }));

    const message = Message.ErrorControl;
    const errorNotification = hasNotification(getState(), message);

    if (errorNotification?.id) {
      dispatch(closeSnackbar(errorNotification.id));
    }
  }

  return payload;
};

export const setError = (payload: boolean | string): AppThunkAction<boolean | string> => (dispatch, getState) => {
  dispatch(actions.setError(payload));

  const message = Message.ErrorGeneric;
  const errorNotification = hasNotification(getState(), message);

  if (!errorNotification) {
    dispatch(
      enqueueSnackbar({
        message,
        options: { variant: 'error', persist: true }
      })
    );
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
