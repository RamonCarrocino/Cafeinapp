import React from 'react';
import {Image, View} from 'react-native';

import styles from './styles';
import Rating from '../rating';
import {Spacer, Text, Touchable} from '../../atoms';

const AVATAR = require('./../../../assets/images/avatar.png');

const FeedCard = ({data, navigation}) => {
  return (
    <View style={[styles.container, styles.elevation]}>
      <View style={styles.infos}>
        <Touchable
          onPress={() => navigation.navigate('profileView', {id: data.user.id})}
          style={styles.profile}>
          <Image
            style={styles.avatar}
            source={
              data.user?.profile?.avatar
                ? {uri: data.user?.profile?.avatar}
                : AVATAR
            }
          />
          <Text format="bodySmall" style={styles.subtitle}>
            @{data.user?.username}
          </Text>
        </Touchable>

        <Spacer size="xs" />

        <Text style={styles.title} format="title">
          {data.product.name}
        </Text>

        <Text format="bodySmall" style={styles.subtitle}>
          {data.product.brand}
        </Text>

        <Spacer size="xs" />

        {/* <View style={{flexDirection: 'row'}}>
          <Text numberOfLines={2} style={{flexShrink: 1}} format="bodySmall">
            {data.comments}
          </Text>
        </View>
        <Spacer size="xs" /> */}

        <View style={styles.rating}>
          <Rating value={data.rating} />
        </View>
      </View>

      <Image
        style={styles.image}
        source={{
          uri: data.attachment || data?.product?.attachments?.[0]?.uri,
        }}
      />
    </View>
  );
};

export default React.memo(FeedCard);
