import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Text, Touchable} from '../../atoms';

import styles from './styles';
import {api} from '../../../services';
import {colors} from '../../../assets/others';

const AVATAR = require('./../../../assets/images/avatar.png');

const MerchantCar = ({data, navigation}) => {
  return (
    <View style={[styles.container, styles.elevation]}>
      <View style={styles.infos}>
        <Touchable
          onPress={() => {
            navigation.navigate('profileView', {id: data.id});
            if (data.featured) {
              api.post('/user/interaction', {users: [data.id], type: 1});
            }
          }}
          style={styles.profile}>
          <FastImage
            style={styles.avatar}
            source={
              data?.profile?.avatar
                ? {
                    uri: data?.profile?.avatar,
                    priority: FastImage.priority.high,
                  }
                : AVATAR
            }
            resizeMode={FastImage.resizeMode.cover}
          />

          <View>
            {data.featured && (
              <Text format="bodySmallBold" color={colors.secondary}>
                Patrocinado
              </Text>
            )}
            <Text format="bodySmall">@{data?.username}</Text>
            <Text format="bodyBold">{data?.name}</Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
};

export default React.memo(MerchantCar);
