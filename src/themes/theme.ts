import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const getTheme = () => {
  //   let overwrites = {
  //     palette: {
  //       type: 'dark',
  //       primary1Color: '#fb8c00',
  //       accent1Color: '#2196f3',
  //       textColor: '#ffffff',
  //       primary2Color: '#78909c',
  //       primary3Color: '#212121',
  //       borderColor: '#78909c',
  //       accent3Color: '#616161',
  //       secondaryTextColor: '#757575',
  //       accent2Color: 'rgba(255, 255, 255, 0.54)',
  //       alternateTextColor: '#424242',
  //     },
  //   };

  let theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#fb8c00',
        contrastText: '#FFF',
      },
      secondary: {
        main: '#2196f3',
      },
      text: {
        primary: '#FFF',
        secondary: '#757575',
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
};

export default getTheme;
