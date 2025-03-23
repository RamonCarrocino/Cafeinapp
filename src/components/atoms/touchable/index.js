import React, {useState, useCallback} from 'react';
import {View, Animated, TouchableWithoutFeedback} from 'react-native';

const friction = 3;
const tension = 150;
const AnimatedView = Animated.createAnimatedComponent(View);

const Touchable = ({children, onPress, style, disabled, activeScale = 0.94}) => {
  const [scale] = useState(new Animated.Value(1));

  const onPressOut = useCallback(
    () =>
      Animated.spring(scale, {
        tension,
        friction,
        toValue: 1,
        useNativeDriver: true,
      }).start(),
    [scale],
  );

  const onPressIn = useCallback(
    () =>
      Animated.spring(scale, {
        tension,
        friction,
        toValue: activeScale,
        useNativeDriver: true,
      }).start(),
    [scale, activeScale],
  );

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      onPressIn={onPressIn.bind(this, scale)}
      onPressOut={onPressOut.bind(this, scale)}>
      <AnimatedView style={[style, {transform: [{scale}]}]}>{children}</AnimatedView>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(Touchable);
