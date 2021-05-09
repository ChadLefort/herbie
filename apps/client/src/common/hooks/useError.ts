import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { wsControl } from '../../app/ws';

export function useError() {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = () => {
      setError(new Error('Error connecting to controls'));
    };

    const handleConnection = () => {
      enqueueSnackbar('Connected to controls', { variant: 'success' });
    };

    wsControl.addEventListener('error', handleError);
    wsControl.addEventListener('open', handleConnection);

    return () => {
      wsControl.removeEventListener('error', handleError);
      wsControl.removeEventListener('open', handleConnection);
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, error]);

  return { error, setError };
}
