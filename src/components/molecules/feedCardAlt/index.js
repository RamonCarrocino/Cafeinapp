import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import styles from './styles';
import Rating from '../rating';
import {Text, Touchable} from '../../atoms';
import {colors} from '../../../assets/others';
import {api} from '../../../services';

const AVATAR = require('./../../../assets/images/coffeeBg.jpg');

const FeedCardAlt = ({data, navigation}) => {
  const navigateTo =
    data.type === 'grade'
      ? 'grade'
      : data.type === 'establishment'
      ? 'profileView'
      : 'product';
  const navigateToParm =
    data.type === 'grade'
      ? 'gradeId'
      : data.type === 'establishment'
      ? 'id'
      : 'productId';

  return (
    <Touchable
      onPress={() => {
        navigation.navigate(navigateTo, {[navigateToParm]: data.id});

        if (data.featured) {
          if (data.type === 'establishment') {
            api.post('/user/interaction', {users: [data.id], type: 1});
          } else if (data.type === 'product') {
            api.post('/product/interaction', {products: [data.id], type: 1});
          }
        }
      }}
      style={[styles.container, {height: data.height}]}>
      <FastImage
        source={data.image ? {uri: data.image} : AVATAR}
        style={styles.image}
      />

      <View style={styles.overlay}>
        {data.featured ? (
          <View
            style={{
              backgroundColor: 'white',
              alignSelf: 'flex-end',
              padding: 7,
              paddingVertical: 3,
              borderRadius: 100,
            }}>
            <Text
              format="bodySmallBold"
              color={colors.secondary}
              style={{fontSize: 10}}>
              Patrocinado
            </Text>
          </View>
        ) : (
          <View />
        )}
        <View>
          {data.type === 'grade' && (
            <Text color="white" format="small" style={{fontStyle: 'italic'}}>
              Nota de
            </Text>
          )}
          <Text color="white" style={{fontWeight: '700'}}>
            {data.name}
          </Text>
          {data.type === 'grade' ? (
            <Rating value={3} tintColor="white" size={18} />
          ) : data.type === 'establishment' ? (
            <Text format="small" color="white">
              @{data.username}
            </Text>
          ) : (
            <Text format="small" color="white">
              Produto
            </Text>
          )}
        </View>
      </View>
    </Touchable>
  );
};

export default React.memo(FeedCardAlt);
