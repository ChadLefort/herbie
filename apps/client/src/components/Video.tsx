import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

import { wsVideoURL } from '../app/ws';
import { useError } from '../common/hooks/useError';
import { Signal } from '../common/Signal';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '50%',
      overflow: 'hidden'
    },
    video: {
      width: '100.2%',
      height: '100%',
      borderRadius: theme.spacing(3)
    }
  })
);

type Props = {
  start?: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export const Video: React.FC<Props> = ({ start, setStart }) => {
  const classes = useStyles();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useError();

  const onLoading = () => setIsLoading(false);

  useEffect(() => {
    let signal: Signal | null = null;

    const onStream = (stream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    const onClose = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      signal?.hangup();
      signal = null;

      setStart(false);
    };

    if (start) {
      videoRef.current?.addEventListener('loadeddata', onLoading);
      signal = new Signal(wsVideoURL, onStream, onClose, setError);
      setIsLoading(true);
    }

    return () => {
      signal?.hangup();
      signal = null;
      videoRef?.current?.removeEventListener('loadeddata', onLoading);
    };
  }, [start, setStart, setError]);

  return start ? (
    <Grid container justify="center" alignItems="center" style={{ height: '100%' }}>
      <div className={classes.container}>
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
      </div>
    </Grid>
  ) : null;
};
