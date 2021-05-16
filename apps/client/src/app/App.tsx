import { blue, grey } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';

import { Controls } from '../components/Controls';
import { store } from './store';

// import { Gamepad } from '../components/Gamepad';

export const App: React.FC = () => {
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
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Controls />
          {/* <Gamepad /> */}
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};
