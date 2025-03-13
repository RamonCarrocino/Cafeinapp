import {LayoutAnimation} from 'react-native';

const presets = [
  {
    duration: 500,
    springDamping: 1,
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
  },
  {
    duration: 200,
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.opacity,
  },
];

const animations = {
  collapse: {
    update: presets[0],
    create: presets[1],
  },
  base: {
    create: presets[0],
    update: presets[0],
    delete: presets[1],
  },
};

export default animations;
