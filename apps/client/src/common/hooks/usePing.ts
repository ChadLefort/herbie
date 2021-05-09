import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { wsControl } from '../../app/ws';

export function usePing(start) {
  const { enqueueSnackbar } = useSnackbar();
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    if (ping && ping <= 8) {
      enqueueSnackbar('Oh snap! Herbie is close to an object.', { variant: 'warning' });
    }
  }, [enqueueSnackbar, ping]);

  const handlePingData = ({ data }: MessageEvent) => {
    console.log(data);
    const { action, payload } = JSON.parse(data);

    if (action === 'ping') {
      setPing(payload);
    }
  };

  useEffect(() => {
    if (start) {
      wsControl.addEventListener('message', handlePingData);
    }

    return () => wsControl.removeEventListener('message', handlePingData);
  }, [start]);
}
