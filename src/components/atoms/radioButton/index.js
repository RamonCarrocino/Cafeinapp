import React from 'react';

import Text from '../text';
import styles from './styles';
import Touchable from '../touchable';
import {colors} from '../../../assets/others';
import {RadioButton as RadioButtonIcon} from '../../../assets/svg/icons';

const RadioButton = ({
  onPress,
  active,
  label,
  labelStyle,
  conatinerStyle,
  iconStyle = styles.icon,
}) => {
  return (
    <Touchable onPress={onPress} style={[styles.container, conatinerStyle]}>
      <RadioButtonIcon
        status={+active}
        width={iconStyle.width}
        height={iconStyle.height}
        fill={active ? colors.primary : colors.grey400}
      />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Touchable>
  );
};

export default React.memo(RadioButton);
