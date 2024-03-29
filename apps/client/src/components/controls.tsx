import { ControlType, Direction, IDirection } from '@herbie/types';
import Box from '@material-ui/core/Box';
import { blue } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ImageIcon from '@material-ui/icons/Image';
import StartIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import { mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import useMouse from '@react-hook/mouse-position';
import React, { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useFullscreen } from '../hooks/use-fullscreen';
import { useKeyPress } from '../hooks/use-keypress';
import { useScreenshot } from '../hooks/use-screenshot';
import { centerHead, moveHead, moveWheels, startHerbie, stopHerbie } from '../slices/controls';
import { Video } from './video';

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
    heroContainer: {
      height: '100%',
      position: 'relative'
    },
    hero: {
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      position: 'relative',
      borderRadius: theme.spacing(3),
      width: '100%',
      height: '100%'
    },
    start: {
      fontSize: '20rem',
      color: blue[900],
      position: 'absolute',
      zIndex: 1,
      margin: '0 auto',
      left: 0,
      right: 0,
      height: '100%'
    },
    buttonLink: {
      height: '100%',
      width: '100%',
      background: 'none',
      border: 'none'
    },
    tooltip: {
      fontSize: '14px'
    }
  })
);

export const Controls: React.FC = () => {
  const mouseRef = useRef(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const classes = useStyles();
  const { isFullscreen, setFullscreen } = useFullscreen(mouseRef);
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.connection);
  const { control, hasStarted } = useAppSelector((state) => state.controls);
  const { takeScreenShotAndSave } = useScreenshot();

  const keyW = useKeyPress('w', hasStarted || false);
  const keyA = useKeyPress('a', hasStarted || false);
  const keyS = useKeyPress('s', hasStarted || false);
  const keyD = useKeyPress('d', hasStarted || false);

  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100
  });

  useEffect(() => {
    if (mouse.x && hasStarted && control?.canControl) {
      dispatch(moveHead({ control: ControlType.Mouse, postion: mouse.x }));
    }
  }, [dispatch, mouse.x, hasStarted, control?.canControl]);

  useEffect(() => {
    if (hasStarted && control?.canControl) {
      const directions: IDirection[] = [
        { direction: Direction.Forward, value: keyW },
        { direction: Direction.Left, value: keyA },
        { direction: Direction.Backward, value: keyS },
        { direction: Direction.Right, value: keyD }
      ];

      const direction = directions.find((direction) => direction.value);
      dispatch(moveWheels(direction));
    }
  }, [hasStarted, keyW, keyA, keyS, keyD, dispatch, control?.canControl]);

  const handleClickStart = () => {
    if (control?.canControl && !error) {
      dispatch(startHerbie());
    }
  };

  const handleClickStop = () => {
    dispatch(stopHerbie());
  };

  const handleClickCenterHead = () => {
    dispatch(centerHead());
  };

  const handleExitFullscreen = () => document.exitFullscreen();

  const handleScreenShot = () => {
    takeScreenShotAndSave({
      canvas: canvasRef.current,
      video: videoRef.current,
      filename: `herbie-${Date.now()}.png`
    });
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Container maxWidth={false} className={classes.root} ref={mouseRef}>
        <Box display="flex" justifyContent="center" alignItems="center" margin="2rem">
          <Icon path={mdiRobot} size={2} color={blue[900]} title="Herbie" className={classes.logo} />
          <Typography variant="h3" className={classes.logoText}>
            Herbie
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" flex="1">
          <Video hasStarted={hasStarted} videoRef={videoRef} canvasRef={canvasRef} />
          {!hasStarted && (
            <Container maxWidth="lg" className={classes.heroContainer}>
              <button
                type="button"
                className={classes.buttonLink}
                style={{ cursor: !control?.canControl || error ? 'not-allowed' : 'pointer' }}
                onClick={handleClickStart}
              >
                <Box className={classes.hero} style={{ backgroundImage: `url('../assets/herbie.webp')` }} />
              </button>
            </Container>
          )}
        </Box>
      </Container>

      <Box display="flex" justifyContent="center">
        {!hasStarted ? (
          <Tooltip TransitionComponent={Fade} classes={{ tooltip: classes.tooltip }} title="Start">
            <span>
              <IconButton
                onClick={handleClickStart}
                classes={{ root: classes.button }}
                disabled={Boolean(!control?.canControl || error)}
              >
                <StartIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip TransitionComponent={Fade} classes={{ tooltip: classes.tooltip }} title="Stop">
            <span>
              <IconButton onClick={handleClickStop} classes={{ root: classes.button }}>
                <StopIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {hasStarted && (
          <React.Fragment>
            <Tooltip TransitionComponent={Fade} classes={{ tooltip: classes.tooltip }} title="Center Camera">
              <span>
                <IconButton onClick={handleClickCenterHead} classes={{ root: classes.button }}>
                  <VerticalAlignCenterIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip TransitionComponent={Fade} classes={{ tooltip: classes.tooltip }} title="Save Screenshot">
              <span>
                <IconButton onClick={handleScreenShot} classes={{ root: classes.button }}>
                  <ImageIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
          </React.Fragment>
        )}
        <Tooltip TransitionComponent={Fade} classes={{ tooltip: classes.tooltip }} title="Fullscreen">
          {isFullscreen ? (
            <span>
              <IconButton onClick={handleExitFullscreen} classes={{ root: classes.button }}>
                <FullscreenExitIcon fontSize="large" />
              </IconButton>
            </span>
          ) : (
            <span>
              <IconButton onClick={setFullscreen} classes={{ root: classes.button }}>
                <FullscreenIcon fontSize="large" />
              </IconButton>
            </span>
          )}
        </Tooltip>
      </Box>
    </Container>
  );
};
