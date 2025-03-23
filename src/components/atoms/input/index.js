import React, {useState} from 'react';
import {TextInput, View} from 'react-native';

import {Spacer, Text} from '../';
import {colors} from '../../../assets/others';
import styles from './styles';

const Input = React.forwardRef(
  (
    {
      row,
      light = false,
      label,
      error,
      style,
      onBlur,
      editable = true,
      placeholder,
      sufix,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <>
        {label && (
          <Text style={styles.label} format="labelInput">
            {label}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
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
            placeholderTextColor={colors.grey400}
            style={[
              styles.input,
              {flex: 1},
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
            ]}
            placeholder={placeholder}
            scrollEnabled={true}
            {...props}
          />
          {sufix && (
            <>
              <Spacer size="nanoWidth" />
              <Text style={styles.label} format="labelInput">
                {sufix}
              </Text>
            </>
          )}
        </View>

        {error && (
          <Text style={styles.error} format="error">
            {error}
          </Text>
        )}
      </>
    );
  },
);

export default React.memo(Input);
