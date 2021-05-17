import { HerbieControlWebSocketAction, IKeyMap, Message } from '@herbie/types';
import { createSlice } from '@reduxjs/toolkit';

import { AppThunkAction } from '../app/store';
import { hasNotification } from '../common/helpers/has-notification';
import { closeAllSnackbars, closeSnackbar, enqueueSnackbar } from './notifications.slice';

type Control = { canControl: boolean; message: string };

const name = 'herbie/controls';

export const setPing = (payload: number): AppThunkAction<number> => (dispatch, getState) => {
  dispatch(actions.setPing(payload));

  const message = Message.WarningPing;
  const pingNotification = hasNotification(getState(), message);

  if (!pingNotification && payload <= 8) {
    dispatch(enqueueSnackbar({ message, options: { variant: 'warning', persist: true } }));
  }

  if (pingNotification?.id && payload > 8) {
    dispatch(closeSnackbar(pingNotification.id));
  }

  return payload;
};

export const setControl = (payload: Control): AppThunkAction<Control> => (dispatch, getState) => {
  const message = Message.InfoCannotControl;
  const cannotControlNotification = hasNotification(getState(), message);

  dispatch(actions.setControl(payload));

  if (!payload.canControl && !cannotControlNotification) {
    dispatch(enqueueSnackbar({ message, options: { variant: 'info', persist: true } }));
  }

  if (payload.canControl && cannotControlNotification?.id) {
    dispatch(closeSnackbar(cannotControlNotification.id));
    dispatch(enqueueSnackbar({ message: payload.message, options: { variant: 'info' } }));
  }

  return payload;
};

export const stopHerbie = (): AppThunkAction<void> => (dispatch) => {
  dispatch(actions.stopHerbie());
  dispatch(closeAllSnackbars());
};

type State = {
  hasStarted: boolean;
  control: Control | null;
  ping: number | null;
};

export const initialState: State = {
  hasStarted: false,
  ping: null,
  control: null
};

const controls = createSlice({
  name,
  initialState,
  reducers: {
    startHerbie: {
      reducer: (state) => {
        state.hasStarted = true;
      },
      prepare: () => ({
        payload: {},
        meta: {
          ws: {
            action: HerbieControlWebSocketAction.Start
          }
        }
      })
    },
    stopHerbie: {
      reducer: (state) => {
        state.hasStarted = false;
      },
      prepare: () => ({
        payload: {},
        meta: {
          ws: {
            action: HerbieControlWebSocketAction.Stop
          }
        }
      })
    },
    moveHead: {
      reducer: (state) => state,
      prepare: (mouseX: number) => ({
        payload: { mouseX },
        meta: {
          ws: {
            action: HerbieControlWebSocketAction.MoveHead,
            payload: Math.round(mouseX / 14.21)
          }
        }
      })
    },
    moveWheels: {
      reducer: (state) => state,
      prepare: (pressedKey: IKeyMap) => ({
        payload: { pressedKey },
        meta: {
          ws: {
            action: HerbieControlWebSocketAction.Keypress,
            payload: pressedKey
          }
        }
      })
    },
    setControl(state, action) {
      state.control = action.payload;
    },
    setPing(state, action) {
      state.ping = action.payload;
    }
  }
});

export const { actions, reducer: controlsReducer } = controls;
export const { startHerbie, moveHead, moveWheels } = actions;
