import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';

import styles from './styles';

const ModalBase = ({
  isVisible,
  setIsVisible,
  children,
  position = 'bottom',
  bgColor = 'white',
  flex = 0,
  ...rest
}) => {
  let style = {};

  if (position === 'bottom') {
    style = {...style, margin: 0, justifyContent: 'flex-end'};
  }

  if (position === 'right') {
    style = {
      ...style,
      margin: 0,
      height: '100%',
      width: '50%',
      alignSelf: 'flex-end',
    };
  }

  if (position === 'map') {
    style = {
      ...style,
      padding: 0,
      bottom: 0,
      position: 'absolute',
      width: '90%',
    };
  }

  return (
    <View>
      <Modal
        onBackdropPress={() => setIsVisible(false)}
        isVisible={isVisible}
        propagateSwipe={false}
        style={style}
        {...rest}>
        <View
          style={[
            styles.modalBody,
            {backgroundColor: bgColor, flex: flex},
            position === 'right' && {padding: 10},
            position === 'map' && {
              padding: 0,
              borderWidth: 1,
            },
          ]}>
          {children}
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(ModalBase);
