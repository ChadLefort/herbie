import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useEffect, useState } from 'react';
import StartIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import useMouse from '@react-hook/mouse-position';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isOpen } from '../common/helpers';
import { useKeyPress } from '../common/useKeyPress';
import { useSnackbar } from 'notistack';
import { Video } from './Video';

const ws = new WebSocket('ws://192.168.86.181:4000/herbie/control');
const navHeight = '67px';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - ${navHeight})`
    },
    container: {
      padding: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(2)
    },
    avatar: {
      width: theme.spacing(50),
      height: theme.spacing(50),
      margin: theme.spacing(2)
    },
    videoContainer: {
      width: '50%',
      overflow: 'hidden'
    },
    video: {
      width: '100.2%',
      height: '100%'
    }
  })
);

export const Controls: React.FC = () => {
  const classes = useStyles();
  const [start, setStart] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const mouseRef = React.useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const keyW = useKeyPress('w', start || false);
  const keyA = useKeyPress('a', start || false);
  const keyS = useKeyPress('s', start || false);
  const keyD = useKeyPress('d', start || false);

  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100
  });

  useEffect(() => {
    if (ping && ping <= 12) {
      enqueueSnackbar('Oh snap! Herbie is close to an object.', { variant: 'warning' });
    }

    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [enqueueSnackbar, error, ping]);

  useEffect(() => {
    if (mouse.x && start && isOpen(ws)) {
      ws.send(JSON.stringify({ action: 'move head', payload: Math.round(mouse.x / 14.21) }));
    }
  }, [mouse.x, start]);

  useEffect(() => {
    if (start && isOpen(ws)) {
      const keys = [
        { key: 'w', value: keyW },
        { key: 'a', value: keyA },
        { key: 's', value: keyS },
        { key: 'd', value: keyD }
      ];

      const pressedKey = keys.find((key) => key.value);
      ws.send(JSON.stringify({ action: 'keypress', payload: pressedKey }));
    }
  }, [start, keyW, keyA, keyS, keyD]);

  const handleClickStart = () => {
    setStart(true);
    setError(null);

    ws.addEventListener('message', handlePingData);

    if (isOpen(ws)) {
      ws.send(JSON.stringify({ action: 'start' }));
    }
  };

  const handleClickStop = useCallback(() => {
    if (isOpen(ws)) {
      ws.send(JSON.stringify({ action: 'stop' }));
    }

    setStart(false);
    ws.removeEventListener('message', handlePingData);
  }, []);

  const handlePingData = ({ data }: MessageEvent) => {
    console.log(data);
    const { action, payload } = JSON.parse(data);

    if (action === 'ping') {
      setPing(payload);
    }
  };

  useEffect(() => {
    return () => handleClickStop();
  }, [handleClickStop]);

  ws.addEventListener('error', () => setError('Error connecting to controls'));

  return (
    <Grid container className={classes.root} ref={mouseRef}>
      <Video start={start} setStart={setStart} setError={setError} />
      <Grid container justify="center" alignItems="center">
        <Grid item>{!start && <Avatar alt="Herbie" src="/herbie.jpg" className={classes.avatar} />}</Grid>
      </Grid>

      <Grid container justify="center" style={start ? { position: 'absolute', bottom: 0, zIndex: 1000 } : undefined}>
        <Grid item>
          <Button
            classes={{ root: classes.button }}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<StartIcon />}
            onClick={handleClickStart}
          >
            Start
          </Button>
        </Grid>
        <Grid item>
          <Button
            classes={{ root: classes.button }}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<StopIcon />}
            onClick={handleClickStop}
          >
            Stop
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
