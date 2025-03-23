import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

import {Text} from '../';
import {colors} from '../../../assets/others';
import {SearchIcon} from '../../../assets/svg/icons';
import styles from './styles';

const SearchInput = React.forwardRef(
  (
    {row, light = false, error, style, onBlur, editable = true, ...props},
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.content}>
        <View style={styles.icon}>
          <View>
            <SearchIcon height={25} width={25} fill={colors.grey600} />
          </View>
        </View>

        <TextInput
          editable={editable}
          ref={ref}
          onFocus={() => {
            setIsFocused(true);
          }}
          placeholderTextColor={colors.grey600}
          style={styles.input}
          placeholder="Pesquisar"
          {...props}
        />
        {error && (
          <Text style={styles.error} format="error">
            {error}
          </Text>
        )}
      </View>
    );
  },
);

export default React.memo(SearchInput);
