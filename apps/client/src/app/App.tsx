import { blue, grey } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme as MuiTheme, ThemeProvider, createMuiTheme, createStyles, makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';

import { Controls } from '../components/Controls';

const useStyles = makeStyles((theme: MuiTheme) =>
  createStyles({
    logo: {
      margin: theme.spacing(2)
    },
    logoText: {
      fontFamily: 'Pacifico, cursive'
    },
    title: {
      flexGrow: 1
    }
  })
);

export const App: React.FC = () => {
  const classes = useStyles();
  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: blue[900]
      },
      secondary: {
        main: grey[500]
      },
      type: 'dark'
    }
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider preventDuplicate anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Controls />
      </SnackbarProvider>
    </ThemeProvider>
  );
};
