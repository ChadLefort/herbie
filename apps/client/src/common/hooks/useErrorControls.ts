import { SnackbarKey, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { wsControl } from '../../app/ws';

export function useErrorControls() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [key, setErrorKey] = useState<SnackbarKey>(null);

  useEffect(() => {
    const handleError = () => {
      setError('Cannot connect to controls server');
    };

    const handleConnection = () => {
      enqueueSnackbar('Connected to controls server', { variant: 'success' });
      closeSnackbar(key);
    };

    wsControl.addEventListener('error', handleError);
    wsControl.addEventListener('open', handleConnection);

    return () => {
      wsControl.removeEventListener('error', handleError);
      wsControl.removeEventListener('open', handleConnection);
    };
  }, [closeSnackbar, enqueueSnackbar, key]);

  useEffect(() => {
    if (error) {
      const key = enqueueSnackbar(error, { variant: 'error', persist: true });
      setErrorKey(key);
    }
  }, [enqueueSnackbar, error]);

  return { error, setError, key };
}
