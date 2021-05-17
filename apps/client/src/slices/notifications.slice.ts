import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { v4 as uuid } from 'uuid';

import { RootState } from '../app/store';

const name = 'notifications';

export type Notification = {
  id?: SnackbarKey;
  message: SnackbarMessage;
  options?: OptionsObject;
  dismissed?: boolean;
};

export const notificationsAdapter = createEntityAdapter<Notification>();
export const notificationsSelectors = notificationsAdapter.getSelectors<RootState>((state) => state.notifications);

const notifications = createSlice({
  name,
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    enqueueSnackbar(state, action: PayloadAction<Notification>) {
      notificationsAdapter.addOne(state, {
        ...action.payload,
        id: action.payload.id || uuid()
      });
    },
    closeSnackbar(state, action: PayloadAction<SnackbarKey>) {
      notificationsAdapter.updateOne(state, { id: action.payload, changes: { dismissed: true } });
    },
    closeAllSnackbars(state) {
      notificationsAdapter.updateMany(
        state,
        state.ids.map((id) => ({ id, changes: { dismissed: true } }))
      );
    },
    removeSnackbar(state, action: PayloadAction<SnackbarKey>) {
      notificationsAdapter.removeOne(state, action.payload);
    }
  }
});

export const {
  actions: { enqueueSnackbar, closeSnackbar, removeSnackbar, closeAllSnackbars },
  reducer: notificationsReducer
} = notifications;
