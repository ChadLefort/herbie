import { HerbieControlWebSocketAction, IKeyMap } from '@herbie/types';
import { createSlice } from '@reduxjs/toolkit';

const name = 'herbie/controls';

type State = {
  hasStarted: boolean;
  control: { canControl: boolean; message: string } | null;
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

export const {
  actions: { startHerbie, stopHerbie, setPing, setControl, moveHead, moveWheels },
  reducer: controlsReducer
} = controls;
