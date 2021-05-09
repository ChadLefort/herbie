import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import StartIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { mdiRobot } from '@mdi/js';
import Icon from '@mdi/react';
import useMouse from '@react-hook/mouse-position';
import React, { useCallback, useEffect, useState } from 'react';

import { wsControl } from '../app/ws';
import { isOpen } from '../common/helpers';
import { useError } from '../common/hooks/useError';
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
    }
  })
);

export const Controls: React.FC = () => {
  const classes = useStyles();
  const [start, setStart] = useState<boolean | undefined>(undefined);

  const mouseRef = React.useRef(null);
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

  useEffect(() => {
    return () => handleClickStop();
  }, [handleClickStop]);

  return (
    <Container maxWidth={false} className={classes.root} ref={mouseRef}>
      <Box display="flex" justifyContent="center" alignItems="center" margin="2rem">
        <Icon path={mdiRobot} size={2} title="Herbie" className={classes.logo} />
        <Typography variant="h3" className={classes.logoText}>
          Herbie
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" flex="1">
        <Video start={start} setStart={setStart} />
        {!start && (
          <Avatar
            variant="rounded"
            classes={{ rounded: classes.rounded }}
            alt="Herbie"
            src="../assets/herbie.jpg"
            className={classes.avatar}
          />
        )}
      </Box>
      <Box display="flex" justifyContent="center">
        <IconButton onClick={handleClickStart} classes={{ root: classes.button }}>
          <StartIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={handleClickStop} classes={{ root: classes.button }}>
          <StopIcon fontSize="large" />
        </IconButton>
      </Box>
    </Container>
  );
};
