import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  containerButtonAnnex: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonAnnex: {
    width: 150,
    height: 150,
    borderRadius: 70,
    marginRight: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
