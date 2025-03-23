import React from 'react';
import {View} from 'react-native';

import styles from './styles';
import {Input, Touchable} from '../../atoms';
import {Eye} from '../../../assets/svg/icons';

const PasswordInput = React.forwardRef((props, ref) => {
  return (
    <View style={styles.viewInput}>
      <Touchable
        onPress={() => props.setShowPass(!props.eyeStatus)}
        style={[styles.icon, {bottom: props.error ? 35 : 15}]}>
        <Eye height={20} width={20} status={+props.eyeStatus} />
      </Touchable>
      <Input {...props} ref={ref} />
    </View>
  );
});

export default React.memo(PasswordInput);
