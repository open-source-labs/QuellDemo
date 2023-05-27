import {createTheme} from '@mui/material/'  
import { fontFamily } from '@mui/system'
import 'typeface-inter';

export const theme = createTheme({
  typography: {
    button: {
      fontFamily: 'Inter, Arial, sans-serif',
      cursor: 'pointer'
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
  palette: {
    primary: {
      main: '#484f57',
      light: '#242424',
      // dark: '#4e90d6',
    },
    secondary: {
      main: '#7DD0E9',
    },
    // overrides: {
    //    MuiButton: {
    //     raisedPrimary: {
    //       color: '',
    // },
    background: {
      default: '#242424',
      paper: '#242424',
    },
    error: {
      main: '#ff5243',
    },
    success: {
      main: '#48aa4c',
    },
  },
  // palette: {
  //   primary: {
  //     main: '#1876d1  ',
  //     light: '#7cd0e9',
  //     dark: '#4e90d6',
  //   },
  //   secondary: {
  //     main: '#484f57',
  //   },
  //   // overrides: {
  //   //    MuiButton: {
  //   //     raisedPrimary: {
  //   //       color: '',
  //   // },
  //   background: {
  //     default: '#e4e4e4',
  //     paper: '#bdbdbd',
  //   },
  //   error: {
  //     main: '#ff5243',
  //   },
  //   success: {
  //     main: '#48aa4c',
  //   },
  // },
})
