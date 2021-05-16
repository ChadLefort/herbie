import { HerbieControlWebSocketAction as Action, ControlAction, IKeyMap } from '@herbie/types';
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
import { SnackbarKey, useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';

import { moveHead, moveWheels, startHerbie, stopHerbie } from '../app/controls.slice';
import { useAppDispatch, useAppSelector } from '../app/store';
import { useErrorControls } from '../common/hooks/useErrorControls';
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
  const mouseRef = useRef(null);
  const classes = useStyles();
  const [maxClients, setMaxClients] = useState<boolean | undefined>(undefined);
  const { isFullscreen, setFullscreen } = useFullscreen(mouseRef);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.connection);
  const { control, hasStarted } = useAppSelector((state) => state.controls);

  useErrorControls();
  usePing();

  const keyW = useKeyPress('w', hasStarted || false);
  const keyA = useKeyPress('a', hasStarted || false);
  const keyS = useKeyPress('s', hasStarted || false);
  const keyD = useKeyPress('d', hasStarted || false);

  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100
  });

  useEffect(() => {
    if (mouse.x && hasStarted) {
      dispatch(moveHead(mouse.x));
    }
  }, [dispatch, mouse.x, hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      const keys: IKeyMap[] = [
        { key: 'w', value: keyW },
        { key: 'a', value: keyA },
        { key: 's', value: keyS },
        { key: 'd', value: keyD }
      ];

      const pressedKey = keys.find((key) => key.value);
      dispatch(moveWheels(pressedKey));
    }
  }, [hasStarted, keyW, keyA, keyS, keyD, dispatch]);

  const handleClickStart = () => {
    dispatch(startHerbie());
  };

  const handleClickStop = () => {
    dispatch(stopHerbie());
  };

  const handleExitFullscreen = () => document.exitFullscreen();

  useEffect(() => {
    if (control) {
      const { canControl, message } = control;
      let key: SnackbarKey | undefined;
      if (canControl === false) {
        key = enqueueSnackbar(message, { variant: 'info', persist: true });
        setMaxClients(true);
      }

      if (canControl === true) {
        closeSnackbar(key);
        enqueueSnackbar(message, { variant: 'info' });
        setMaxClients(false);
      }
    }
  }, [control, closeSnackbar, enqueueSnackbar]);

  return (
    <Container maxWidth={false} className={classes.root} ref={mouseRef}>
      <Box display="flex" justifyContent="center" alignItems="center" margin="2rem">
        <Icon path={mdiRobot} size={2} color={blue[900]} title="Herbie" className={classes.logo} />
        <Typography variant="h3" className={classes.logoText}>
          Herbie
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" flex="1">
        <Video />
        {!hasStarted && (
          <Container maxWidth="lg" style={{ height: '100%' }}>
            <Box className={classes.hero} style={{ backgroundImage: `url('../assets/herbie.webp')` }} />
          </Container>
        )}
      </Box>

      <Box display="flex" justifyContent="center">
        {!hasStarted ? (
          <IconButton onClick={handleClickStart} classes={{ root: classes.button }} disabled={maxClients || error}>
            <StartIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton onClick={handleClickStop} classes={{ root: classes.button }} disabled={maxClients || error}>
            <StopIcon fontSize="large" />
          </IconButton>
        )}
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
