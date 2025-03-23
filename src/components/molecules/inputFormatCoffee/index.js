import React from 'react';
import {View} from 'react-native';
import {Spacer, Text, Touchable} from '../../atoms';

import {styles} from './styles';
import {colors} from '../../../assets/others';

const InputFormatCoffee = ({setFieldValue, value, touched, error}) => {
  return (
    <>
      <Text format="labelInput">Formato do café</Text>
      <Spacer size="nano" />

      <View>
        <Touchable
          style={styles.option}
          onPress={() => setFieldValue('format', 'Em grão')}>
          <View
            style={[
              styles.radioBtn,

              {
                backgroundColor: value === 'Em grão' ? colors.orange : 'white',
              },
            ]}
          />

          <Spacer size="smallWidth" />
          <Text format="labelInput">Em grão</Text>
        </Touchable>

        <Touchable
          style={styles.option}
          onPress={() => setFieldValue('format', 'Moído')}>
          <View
            style={[
              styles.radioBtn,

              {
                backgroundColor: value === 'Moído' ? colors.orange : 'white',
              },
            ]}
          />

          <Spacer size="smallWidth" />
          <Text format="labelInput">Moído</Text>
        </Touchable>

        {/* <Touchable
          style={styles.option}
          onPress={() => setFieldValue('format', 'Drip')}>
          <View
            style={[
              styles.radioBtn,

              {
                backgroundColor: value === 'Drip' ? '#CC9424' : 'white',
              },
            ]}
          />

          <Spacer size="smallWidth" />
          <Text format="labelInput">Drip</Text>
        </Touchable> */}
      </View>

      {touched && error && (
        <Text style={styles.error} format="error">
          {error}
        </Text>
      )}
    </>
  );
};

export default React.memo(InputFormatCoffee);
