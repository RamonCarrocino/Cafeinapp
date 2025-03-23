import React from 'react';
import {Image, View} from 'react-native';
import {Annex} from '../../../assets/svg/icons';
import {Spacer, Text, Touchable} from '../../atoms';

import styles from './styles';

const InputUpload = ({handleUpload, uri, label}) => {
  return (
    <Touchable onPress={handleUpload} style={styles.containerButtonAnnex}>
      <View style={styles.buttonAnnex}>
        <Annex />
      </View>
      <Text format="labelInput">{label}</Text>
      <Spacer size="nanoWidth" />
      <Image
        style={{width: 50, height: 50}}
        source={{
          uri: uri,
        }}
      />
    </Touchable>
  );
};

export default React.memo(InputUpload);
