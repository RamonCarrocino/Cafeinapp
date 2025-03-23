import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

import {Text} from '../';
import {colors} from '../../../assets/others';
import {SearchIcon} from '../../../assets/svg/icons';
import Touchable from '../touchable';
import styles from './styles';

const MapSearchInput = React.forwardRef(
  (
    {
      row,
      light = false,
      error,
      style,
      onBlur,
      editable = true,
      onPress,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.content}>
        <TextInput
          editable={editable}
          ref={ref}
          onFocus={() => {
            setIsFocused(true);
          }}
          placeholderTextColor={colors.grey600}
          style={styles.input}
          {...props}
        />
        <Touchable style={styles.icon} onPress={onPress}>
          <View>
            <SearchIcon height={25} width={25} fill={colors.grey600} />
          </View>
        </Touchable>
        {error && (
          <Text style={styles.error} format="error">
            {error}
          </Text>
        )}
      </View>
    );
  },
);

export default React.memo(MapSearchInput);
