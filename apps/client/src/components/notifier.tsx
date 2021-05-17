import { SnackbarKey, useSnackbar } from 'notistack';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../app/store';
import { notificationsSelectors, removeSnackbar } from '../slices/notifications';

let displayed: SnackbarKey[] = [];

const Notifier = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(notificationsSelectors.selectAll);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(({ id, message, options = {}, dismissed = false }) => {
      if (id && dismissed) {
        closeSnackbar(id);
        return;
      }

      if (id && displayed.includes(id)) return;

      enqueueSnackbar(message, {
        key: id,
        autoHideDuration: 6000,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (_, myKey) => {
          dispatch(removeSnackbar(myKey));
          removeDisplayed(myKey);
        }
      });

      id && storeDisplayed(id);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
