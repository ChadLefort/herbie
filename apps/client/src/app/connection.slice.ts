import { createSlice } from '@reduxjs/toolkit';

import { startHerbie } from './controls.slice';

const name = 'herbie/connection';

type State = {
  connected: boolean;
  error: boolean;
};

export const initialState: State = {
  connected: false,
  error: null
};

const connection = createSlice({
  name,
  initialState,
  reducers: {
    setConnection(state, action) {
      state.error = null;
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

export const {
  actions: { setConnection, setError },
  reducer: connectionReducer
} = connection;
