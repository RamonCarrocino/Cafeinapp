import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

export default StyleSheet.create({
  input: {
    borderRadius: 15,
    paddingHorizontal: 40,
    paddingVertical: 5,
    height: 120,
    color: 'black',
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 50,
    width: 600,
  },

  label: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },
});
