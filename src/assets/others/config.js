import {Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';

import colors from './colors';

const config = {
  VERSION: 0.1,
  behavior: Platform.select({ios: 'padding'}),
  // baseUrl: 'http://192.168.15.7:8088',
  baseUrl: 'https://api.cafeinapp.com.br',

  snackbarError: {
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: colors.red,
    action: {
      text: 'FECHAR',
      textColor: 'white',
    },
  },
  snackbarSuccess: {
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: colors.green,
    action: {
      text: 'FECHAR',
      textColor: 'white',
    },
  },
  snackbarWarning: {
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: colors.orange,
    action: {
      text: 'FECHAR',
      textColor: 'white',
    },
  },

  dayjs: {
    calendar_messages: {
      sameDay: '[HOJE]',
      nextDay: '[AMANHÃ]',
      nextWeek: 'dddd',
      lastDay: '[ONTEM]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY',
    },
  },

  oneSignal: '15a69122-f4e8-4cc0-b12d-e226e02cd1e8',
  // mapboxGLAccessToken:
  //   'pk.eyJ1Ijoidml0b3ItZmFjaW9saSIsImEiOiJjbDh1ZnZwYTYwMzY4M3ZvY2RzNTFvYm1mIn0.ph210IRly0s91szcZl8dcQ', //public
  mapboxGLAccessToken:
    'sk.eyJ1IjoicmFtb25jYXJyb2Npbm8iLCJhIjoiY2xlcHQzbG8zMGZuejNwcGt4a3Zib2Z3cyJ9.IXnUTq6AZx96slExcBAuPQ', //secret
};

export default config;
