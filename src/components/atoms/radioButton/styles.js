import {StyleSheet} from 'pr-unit';

import {metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  label: {
    marginLeft: metrics.smaller,
  },

  icon: {
    width: metrics.medium,
    height: metrics.medium,
  },
});

export default styles;
