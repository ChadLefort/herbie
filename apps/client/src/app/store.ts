import { Message } from '@herbie/types';
import { websocketMiddleware } from '@herbie/utils';
import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit';

import { connectionReducer, setConnection, setError } from '../slices/connection';
import { controlsReducer } from '../slices/controls';
import { notificationsReducer } from '../slices/notifications';
import { wsControl as connection } from './ws';
import { herbieWebsocketBuilder as websocketBuilder } from './ws-builder';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    connection: connectionReducer,
    controls: controlsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware({ connection, websocketBuilder }))
});

connection.onopen = () => {
  store.dispatch(setConnection(true));
};

connection.onclose = () => {
  store.dispatch(setConnection(false));
};

connection.onerror = () => {
  store.dispatch(setError(Message.ErrorControl));
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkAction<T> = ThunkAction<T, RootState, null, AnyAction>;
