import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3949AB',
      dark: '#283593',
    },
    secondary: {
      main: '#FFB300',
    },
    error: {
      main: '#E53935',
    },
    success: {
      main: '#43A047',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
