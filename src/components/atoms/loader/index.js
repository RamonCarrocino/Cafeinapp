import React from 'react';
import {View, ActivityIndicator, Image} from 'react-native';

import styles from './styles';
import {colors} from '../../../assets/others';
import Text from '../text';

const Loader = ({
  useGif = true,
  color = colors.primary,
  size = 'large',
  style: customStyle,
}) => (
  <View style={[styles.container, customStyle]}>
    {useGif ? (
      <Image
        style={styles.gif}
        source={require('./../../../assets/images/loading.gif')}
      />
    ) : (
      <ActivityIndicator size={size} color={color} />
    )}
  </View>
);

export default React.memo(Loader, () => true);
