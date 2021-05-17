import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../app/store';
import { wsVideoURL } from '../app/ws';
import { useErrorVideo } from '../common/hooks/useErrorVideo';
import { Signal } from '../common/Signal';

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
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useErrorVideo();

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

    if (hasStarted) {
      ref?.addEventListener('loadeddata', onLoading);
      signal = new Signal(wsVideoURL, onStream, onClose, setError);
      setIsLoading(true);
    }

    return () => {
      signal?.hangup();
      signal = null;
      ref?.removeEventListener('loadeddata', onLoading);
    };
  }, [hasStarted, setError]);

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
