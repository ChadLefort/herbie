import { websocketMiddleware } from '@herbie/utils';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { connectionReducer, setConnection, setError } from './connection.slice';
import { controlsReducer } from './controls.slice';
import { notificationsReducer } from './notifications.slice';
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
  store.dispatch(setError(true));
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
