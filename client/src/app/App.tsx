import AppBar from '@material-ui/core/AppBar';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HerbieEyesIcon from '@material-ui/icons/Voicemail';
import React, { useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import { Controls } from '../components/Controls';
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme as MuiTheme,
  ThemeProvider
  } from '@material-ui/core/styles';
import { green, grey } from '@material-ui/core/colors';
import { SnackbarProvider } from 'notistack';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: MuiTheme) =>
  createStyles({
    logo: {
      margin: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    formLabel: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
);

type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

export const App: React.FC = () => {
  const classes = useStyles();
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: green[900]
      },
      secondary: {
        main: grey[500]
      },
      type: theme
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <SnackbarProvider preventDuplicate anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <AppBar position="static">
            <Toolbar>
              <HerbieEyesIcon fontSize="large" className={classes.logo} />
              <div className={classes.title}>
                <Typography variant="h6">Herbie</Typography>
              </div>
              <FormControlLabel
                className={classes.formLabel}
                control={<Switch checked={theme === 'dark'} onClick={toggleTheme} name="theme" />}
                label={theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              />
            </Toolbar>
          </AppBar>
          <Controls />
        </SnackbarProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
