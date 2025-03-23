import React from 'react';

import styles from './styles';
import {Text, Touchable} from '../../atoms';
import {LeftChevron} from '../../../assets/svg/icons';

const GoBack = ({text, onPress, fill = '#FFF'}) => {
  const titleStyle = {...styles.title, color: fill};

  return (
    <Touchable style={styles.wrapperTitle} onPress={onPress}>
      <LeftChevron fill={fill} width={styles.chevron.width} height={styles.chevron.height} />
      {text && (
        <Text format="h1" style={titleStyle}>
          {text}
        </Text>
      )}
    </Touchable>
  );
};

export default React.memo(GoBack);
