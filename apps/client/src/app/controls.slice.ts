import { HerbieControlWebSocketAction, IKeyMap } from '@herbie/types';
import { AnyAction, ThunkAction, createSlice } from '@reduxjs/toolkit';

import { closeAllSnackbars, closeSnackbar, enqueueSnackbar, notificationsSelectors } from './notifications.slice';
import { RootState } from './store';

type Control = { canControl: boolean; message: string };

const name = 'herbie/controls';

export const setPing = (payload: number): ThunkAction<number, RootState, null, AnyAction> => (dispatch, getState) => {
  dispatch(actions.setPing(payload));

  const message = 'Oh snap! Herbie is close to an object.';
  const pingNotification = notificationsSelectors
    .selectAll(getState() as RootState)
    .find((notification) => notification.message === message);

  if (!pingNotification && payload <= 8) {
    dispatch(enqueueSnackbar({ message, options: { variant: 'warning', persist: true } }));
  }

  if (pingNotification && payload > 8) {
    dispatch(closeSnackbar(pingNotification.id));
  }

  return payload;
};

export const setControl = (payload: Control): ThunkAction<Control, RootState, null, AnyAction> => (
  dispatch,
  getState
) => {
  const message = 'Only one client can be connected at a time.';
  const cannotControlNotification = notificationsSelectors
    .selectAll(getState() as RootState)
    .find((notification) => notification.message === message);

  dispatch(actions.setControl(payload));

  if (!payload.canControl && !cannotControlNotification) {
    dispatch(enqueueSnackbar({ message, options: { variant: 'info', persist: true } }));
  }

  if (payload.canControl && cannotControlNotification) {
    dispatch(closeSnackbar(cannotControlNotification.id));
    dispatch(enqueueSnackbar({ message: payload.message, options: { variant: 'info' } }));
  }

  return payload;
};

export const stopHerbie = (): ThunkAction<void, RootState, null, AnyAction> => (dispatch) => {
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
      reducer: null,
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
      reducer: null,
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
