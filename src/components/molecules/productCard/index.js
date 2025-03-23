import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Spacer, Text} from '../../atoms';
import Rating from '../rating';

import styles from './styles';
import {colors} from '../../../assets/others';

const ProductCard = ({
  status,
  renderStatus = false,
  name,
  rating,
  image,
  brand,
  featured,
}) => {
  return (
    <View style={[styles.container, styles.elevation]}>
      <View style={styles.infos}>
        <View>
          {featured && (
            <Text format="bodySmallBold" color={colors.secondary}>
              Patrocinado
            </Text>
          )}
          <Text style={styles.title} format="title">
            {name}
          </Text>

          <Text format="bodySmall" style={styles.subtitle}>
            {brand}
          </Text>
        </View>

        {renderStatus && status === 0 && (
          <Text format="bodyBold">Não visível</Text>
        )}
        <Spacer size="xs" />

        <View style={styles.rating}>
          <Rating size={18} value={Math.round(rating)} />
        </View>
      </View>

      <FastImage
        style={styles.image}
        source={{
          uri: image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      {/* <Image style={styles.image} source={{uri: image}} /> */}
    </View>
  );
};

export default React.memo(ProductCard);
