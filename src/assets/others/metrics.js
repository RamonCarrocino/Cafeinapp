import {Dimensions, StatusBar, Platform} from 'react-native';

const metrics = {
  medium: 48,
  short: 36,
  small: 24,
  smaller: 12,
  big: 72,
  bigger: 96,

  border: 4,

  label: 36,

  width: () => Dimensions.get('window').width,
  height: () => {
    const notchHeight =
      Platform.OS === 'android' && Math.floor(StatusBar.currentHeight) > 24
        ? StatusBar.currentHeight
        : 0;
    return Dimensions.get('window').height + notchHeight;
  },
};

export default metrics;
