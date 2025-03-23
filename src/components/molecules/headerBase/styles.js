import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: metrics.big,
    paddingVertical: metrics.bigger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  btnGoBack: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 700,
    height: 256,
  },
});

export default styles;
