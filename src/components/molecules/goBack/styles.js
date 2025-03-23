import {StyleSheet} from 'pr-unit';

import {metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  wrapperTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: metrics.small,
    paddingVertical: metrics.small,
  },

  chevron: {
    width: metrics.medium,
    height: metrics.medium,
  },

  title: {
    marginLeft: metrics.small,
  },
});

export default styles;
