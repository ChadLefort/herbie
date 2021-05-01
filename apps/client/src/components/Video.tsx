import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

import { Signal } from '../common/Signal';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '50%',
      overflow: 'hidden'
    },
    video: {
      width: '100.2%',
      height: '100%'
    }
  })
);

type Props = {
  start?: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const Video: React.FC<Props> = ({ start, setStart, setError }) => {
  const classes = useStyles();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      signal = new Signal('ws://192.168.86.181:3000/herbie/video', onStream, onClose, setError);
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
        {isLoading && <LinearProgress />}
      </div>
    </Grid>
  ) : null;
};
