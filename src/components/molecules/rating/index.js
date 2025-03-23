import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {Touchable} from '../../atoms';

import styles from './styles';

const CUP_IMAGE = require('./../../../assets/images/cup.png');
const CUP_FULL_IMAGE = require('./../../../assets/images/cup-full.png');

const Rating = ({value, onChange, tintColor = 'black', size = 30}) => {
  const [ratingSelected, setRatingSelected] = useState(value || -1);

  useEffect(() => {
    setRatingSelected(value);
  });

  const handleSelect = star => {
    if (onChange) {
      setRatingSelected(star);
      onChange(star);
    }
  };

  return (
    <View style={styles.rating}>
      {[1, 2, 3, 4, 5].map((item, index) => (
        <Touchable onPress={() => handleSelect(item)}>
          {item <= ratingSelected ? (
            <Image
              style={{
                width: size,
                height: size,
                marginRight: 1,
                tintColor,
              }}
              source={CUP_FULL_IMAGE}
            />
          ) : (
            <Image
              style={{width: size, height: size, marginRight: 1, tintColor}}
              source={CUP_IMAGE}
            />
          )}
        </Touchable>
      ))}
    </View>
  );
};

export default React.memo(Rating);
