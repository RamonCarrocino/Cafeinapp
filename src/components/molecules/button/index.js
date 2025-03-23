import React from 'react';

import styles from './styles';
import {Touchable, Text, Loader} from '../../atoms';

const Button = ({
  style: customStyle,
  outline,
  row,
  text,
  onPress,
  disabled,
  loading,
  RightComponent,
}) => {
  const textStyle = [styles.textBase];
  const buttonStyle = [styles.containerBase];

  if (row) {
    buttonStyle.push(styles.containerRow);
  }

  if (outline) {
    buttonStyle.push(styles.containerOutline);
  } else {
    buttonStyle.push(styles.container);
  }

  if (customStyle) {
    buttonStyle.push(customStyle);
  }

  if (disabled) {
    buttonStyle.push(styles.disabled);
  }

  if (outline) {
    textStyle.push(styles.textOutline);
  } else {
    textStyle.push(styles.text);
  }

  if (customStyle?.color) {
    textStyle.push({color: customStyle.color});
  }

  if (customStyle?.fontSize) {
    textStyle.push({fontSize: customStyle.fontSize});
  }

  return (
    <Touchable style={buttonStyle} onPress={onPress} disabled={disabled}>
      {RightComponent && RightComponent}

      {!loading ? (
        <Text format="button" style={textStyle}>
          {text}
        </Text>
      ) : (
        <Loader useGif={false} color="#FFF" style={styles.loader} />
      )}
    </Touchable>
  );
};

export default React.memo(Button);
