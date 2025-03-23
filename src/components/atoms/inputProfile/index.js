import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

import {Text} from '../';
import {colors} from '../../../assets/others';
import styles from './styles';

const InputProfile = React.forwardRef(
  (
    {
      row,
      light = false,
      label,
      error,
      style,
      onBlur,
      editable = true,
      styleInput,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View
        style={[
          label && {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          style,
        ]}>
        {label && (
          <Text style={styles.label} format="labelInput">
            {label}:
          </Text>
        )}

        <View>
          <TextInput
            editable={editable}
            ref={ref}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            placeholderTextColor={colors.grey600}
            style={[
              styles.input,
              {
                borderColor: error
                  ? colors.red
                  : isFocused
                  ? colors.secondary
                  : colors.primary,
                backgroundColor: editable ? colors.grey200 : colors.grey400,
                borderWidth: error ? 1 : 0,
              },
              label && {textAlign: 'left'},
              styleInput,
            ]}
            {...props}
          />
          {error && !label && (
            <Text style={styles.error} format="error">
              {error}
            </Text>
          )}
        </View>
      </View>
    );
  },
);

export default React.memo(InputProfile);
