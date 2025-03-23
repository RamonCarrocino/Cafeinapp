import Snackbar from 'react-native-snackbar';
import {PermissionsAndroid} from 'react-native';

import {config} from '../assets/others';

export {default as storage} from './storage';

export const onSuccess = (e, text, showSnackbar = true) => {
  if (showSnackbar) {
    const {message, response} = e || {};
    Snackbar.show({
      ...config.snackbarSuccess,
      text: text ?? response?.data?.message ?? message,
    });
  }
};
export const onError = (e, text, showSnackbar = true) => {
  if (showSnackbar) {
    const {message, response} = e || {};
    Snackbar.show({
      ...config.snackbarError,
      text: text ?? response?.data?.message ?? message,
    });
  }
};
export const onWarning = (e, text, showSnackbar = true) => {
  if (showSnackbar) {
    const {message, response} = e || {};
    Snackbar.show({
      ...config.snackbarWarning,
      text: text ?? response?.data?.message ?? message,
    });
  }
};

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permissão de câmera',
        message:
          'Nasiol precisa da permissão da câmera para poder inserir imagens',
        buttonNeutral: 'Perguntar depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};
