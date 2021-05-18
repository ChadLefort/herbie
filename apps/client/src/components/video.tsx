import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

import { wsVideoURL } from '../app/ws';
import { Signal } from '../common/signal';
import { useAppDispatch } from '../hooks/redux';
import { setError } from '../slices/connection';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100vh',
      overflow: 'hidden'
    },
    video: {
      width: '100%',
      borderRadius: theme.spacing(3)
    }
  })
);

type Props = {
  hasStarted: boolean;
};

export const Video: React.FC<Props> = ({ hasStarted }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLoading = () => setIsLoading(false);

  useEffect(() => {
    const ref = videoRef?.current;
    let signal: Signal | null = null;

    const onStream = (stream: MediaStream) => {
      if (ref) {
        ref.srcObject = stream;
        ref.play();
      }
    };

    const onClose = () => {
      if (ref) {
        ref.srcObject = null;
      }

      signal?.hangup();
      signal = null;
    };

    const onError = (error: string) => {
      dispatch(setError(error));
    };

    if (hasStarted) {
      ref?.addEventListener('loadeddata', onLoading);
      signal = new Signal(wsVideoURL, onStream, onClose, onError);
      setIsLoading(true);
    }

    return () => {
      signal?.hangup();
      signal = null;
      ref?.removeEventListener('loadeddata', onLoading);
    };
  }, [dispatch, hasStarted]);

  return hasStarted ? (
    <Box className={classes.container}>
      <video
        ref={videoRef}
        className={classes.video}
        preload="auto"
        autoPlay
        style={isLoading ? { display: 'none' } : undefined}
      />
      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={100} />
        </Box>
      )}
    </Box>
  ) : null;
};
