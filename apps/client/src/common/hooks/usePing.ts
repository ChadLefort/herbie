import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

import { useAppSelector } from '../../app/store';

export function usePing() {
  const { enqueueSnackbar } = useSnackbar();
  const { ping } = useAppSelector((state) => state.controls);

  useEffect(() => {
    if (ping && ping <= 8) {
      enqueueSnackbar('Oh snap! Herbie is close to an object.', { variant: 'warning' });
    }
  }, [enqueueSnackbar, ping]);
}
