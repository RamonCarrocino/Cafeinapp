import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  containerBase: {
    height: 140,
    borderRadius: 20,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    backgroundColor: colors.primary,
  },

  text: {
    color: '#FFF',
  },

  containerOutline: {
    borderWidth: metrics.border,
    borderColor: colors.primary,
  },

  textOutline: {
    color: colors.primary,
  },

  containerRow: {
    flex: 1,
    alignSelf: undefined,
  },

  disabled: {
    opacity: 0.6,
  },

  loader: {
    flex: undefined,
  },
});

export default styles;
