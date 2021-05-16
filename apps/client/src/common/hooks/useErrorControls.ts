import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import { useAppSelector } from '../../app/store';

export function useErrorControls() {
  const { enqueueSnackbar } = useSnackbar();
  const { error, connected } = useAppSelector((state) => state.connection);

  useEffect(() => {
    if (connected) {
      enqueueSnackbar('Connected to controls server', { variant: 'success' });
    }

    if (error) {
      enqueueSnackbar('Error with controls server', { variant: 'error' });
    }
  }, [connected, enqueueSnackbar, error]);
}
