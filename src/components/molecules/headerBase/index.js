import React from 'react';
import {View, Image} from 'react-native';

import styles from './styles';
import {LeftChevron, Hamburguer} from './../../../assets/svg/icons';
import {Touchable, Text} from '../../atoms';
import {colors} from '../../../assets/others';

const HeaderBase = ({
  navigation,
  goTo,
  hasGoBack = true,
  renderHamburger = true,
}) => {
  return (
    <View style={styles.container}>
      {hasGoBack && (
        <Touchable
          style={styles.btnGoBack}
          onPress={() => (goTo ? navigation.navigate(goTo) : navigation.pop())}>
          <LeftChevron width={30} height={30} fill={colors.secondary} />
        </Touchable>
      )}

      <Image
        source={require('./../../../assets/images/logo/logo-with-text.png')}
        style={styles.logo}
      />

      {renderHamburger ? (
        <Touchable onPress={() => navigation.navigate('profile')}>
          <Hamburguer />
        </Touchable>
      ) : (
        <View />
      )}
    </View>
  );
};

export default React.memo(HeaderBase);
