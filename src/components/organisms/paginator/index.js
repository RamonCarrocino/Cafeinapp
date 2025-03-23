import React, {useRef, useEffect, useCallback} from 'react';
import {ScrollView, View} from 'react-native';

import styles from './styles';
import {metrics} from '../../../assets/others';

const Wrapper = ({
  progress,
  children,
  onScrollEnd: callback,
  scrollEnabled = false,
}) => {
  const scroll = useRef();

  const onScrollEnd = useCallback(
    ({nativeEvent: e}) => {
      if (scrollEnabled) {
        callback(Math.round(e.contentOffset.x / metrics.width()));
      }
    },
    [callback, scrollEnabled],
  );

  useEffect(() => {
    if (!scrollEnabled) {
      scroll.current.scrollTo({x: progress * metrics.width()});
    }
  }, [progress, scrollEnabled]);

  return (
    <ScrollView
      horizontal
      ref={scroll}
      pagingEnabled={true}
      style={styles.container}
      scrollEnabled={scrollEnabled}
      onMomentumScrollEnd={onScrollEnd}
      keyboardShouldPersistTaps={'never'}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScroll}>
      {children}
    </ScrollView>
  );
};

const Item = ({children, style: customStyle, scrollEnabled = true}) => {
  return scrollEnabled ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, customStyle]}
      keyboardShouldPersistTaps={'never'}
      showsVerticalScrollIndicator={false}
      style={styles.wrapperItem}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.wrapperItem, customStyle]}>{children}</View>
  );
};

const createPaginator = () => ({Wrapper, Item});

export default createPaginator;
