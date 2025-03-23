import React from 'react';
import {Text as RNText} from 'react-native';

import styles from './styles';

const Text = ({
  style,
  children,
  format = 'body',
  align = 'left',
  color = 'black',
  ...props
}) => {
  return (
    <RNText
      {...props}
      style={[styles[format], {textAlign: align, color}, style]}>
      {children}
    </RNText>
  );
};

export default React.memo(Text);
