import Box from '@material-ui/core/Box';
import { blue } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import StartIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import useMouse from '@react-hook/mouse-position';
import React, { useCallback, useEffect, useState } from 'react';

import { wsControl } from '../app/ws';
import { isOpen } from '../common/helpers';
import { useError } from '../common/hooks/useError';
import { useFullscreen } from '../common/hooks/useFullscreen';
import { useKeyPress } from '../common/hooks/useKeyPress';
import { usePing } from '../common/hooks/usePing';
import { Video } from './Video';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column'
    },
    container: {
      padding: theme.spacing(2)
    },
    logo: {
      margin: theme.spacing(2)
    },
    logoText: {
      fontFamily: 'Pacifico, cursive'
    },
    button: {
      margin: theme.spacing(2)
    },
    avatar: {
      width: theme.spacing(75),
      height: theme.spacing(75),
      margin: theme.spacing(2)
    },
    rounded: {
      borderRadius: theme.spacing(3)
    },
    hero: {
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      position: 'relative',
      borderRadius: theme.spacing(3),
      width: '100%',
      height: '100%'
    }
  })
);

export const Controls: React.FC = () => {
  const mouseRef = React.useRef(null);
  const classes = useStyles();
  const [start, setStart] = useState<boolean | undefined>(undefined);
  const { isFullscreen, setFullscreen } = useFullscreen(mouseRef);
  const { setError } = useError();

  usePing(start);

  const keyW = useKeyPress('w', start || false);
  const keyA = useKeyPress('a', start || false);
  const keyS = useKeyPress('s', start || false);
  const keyD = useKeyPress('d', start || false);

  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100
  });

  useEffect(() => {
    if (mouse.x && start && isOpen(wsControl)) {
      wsControl.send(JSON.stringify({ action: 'move head', payload: Math.round(mouse.x / 14.21) }));
    }
  }, [mouse.x, start]);

  useEffect(() => {
    if (start && isOpen(wsControl)) {
      const keys = [
        { key: 'w', value: keyW },
        { key: 'a', value: keyA },
        { key: 's', value: keyS },
        { key: 'd', value: keyD }
      ];

      const pressedKey = keys.find((key) => key.value);
      wsControl.send(JSON.stringify({ action: 'keypress', payload: pressedKey }));
    }
  }, [start, keyW, keyA, keyS, keyD]);

  const handleClickStart = () => {
    setStart(true);
    setError(null);

    if (isOpen(wsControl)) {
      wsControl.send(JSON.stringify({ action: 'start' }));
    }
  };

  const handleClickStop = useCallback(() => {
    if (isOpen(wsControl)) {
      wsControl.send(JSON.stringify({ action: 'stop' }));
    }

    setStart(false);
  }, []);

  const handleExitFullscreen = () => document.exitFullscreen();

  useEffect(() => {
    return () => handleClickStop();
  }, [handleClickStop]);

  return (
    <Container maxWidth={false} className={classes.root} ref={mouseRef}>
      <Box display="flex" justifyContent="center" alignItems="center" margin="2rem">
        <Icon path={mdiRobot} size={2} color={blue[900]} title="Herbie" className={classes.logo} />
        <Typography variant="h3" className={classes.logoText}>
          Herbie
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" flex="1">
        <Video start={start} setStart={setStart} />
        {!start && (
          <Container maxWidth="md" style={{ height: '100%' }}>
            <Box className={classes.hero} style={{ backgroundImage: `url('../assets/herbie.jpg')` }} />
          </Container>
        )}
      </Box>
      <Box display="flex" justifyContent="center">
        <IconButton onClick={handleClickStart} classes={{ root: classes.button }}>
          <StartIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={handleClickStop} classes={{ root: classes.button }}>
          <StopIcon fontSize="large" />
        </IconButton>
        {isFullscreen ? (
          <IconButton onClick={handleExitFullscreen} classes={{ root: classes.button }}>
            <FullscreenExitIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={setFullscreen} classes={{ root: classes.button }}>
            <FullscreenIcon fontSize="large" />
          </IconButton>
        )}
      </Box>
    </Container>
  );
};
