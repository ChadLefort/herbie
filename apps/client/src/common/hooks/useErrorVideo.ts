import { SnackbarKey, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

export function useErrorVideo() {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  const [key, setErrorKey] = useState<SnackbarKey>(null);

  useEffect(() => {
    if (error) {
      const key = enqueueSnackbar(error, { variant: 'error', persist: true });
      setErrorKey(key);
    }
  }, [enqueueSnackbar, error]);

  return { error, setError, key };
}
