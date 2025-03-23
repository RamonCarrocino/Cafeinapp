import React from 'react';
import {View} from 'react-native';

import styles from './styles';

const Text = ({size = 'big'}) => {
  return <View style={styles[size]} />;
};

export default React.memo(Text);
