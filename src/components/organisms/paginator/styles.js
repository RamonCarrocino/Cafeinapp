import {StyleSheet} from 'pr-unit';

import {metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  horizontalScroll: {
    flexGrow: 1,
  },

  wrapperItem: {
    flex: 1,
    width: `_${metrics.width()}`,
  },

  scroll: {},
});

export default styles;
