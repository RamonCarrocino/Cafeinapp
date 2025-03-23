import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  optionSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.grey300,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },

  labelSelect: {fontWeight: 'bold', textAlign: 'center'},

  containerItems: {
    alignItems: 'center',
  },

  itemSelect: {
    width: '70%',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 5,
    paddingVertical: 40,
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },
});

export default styles;
