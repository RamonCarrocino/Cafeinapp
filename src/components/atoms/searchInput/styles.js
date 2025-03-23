import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

export default StyleSheet.create({
  content: {
    position: 'relative',
    // backgroundColor: 'blue',
  },

  icon: {
    position: 'absolute',
    flex: 1,
    width: '35%',
    height: 118,
    // backgroundColor: 'red',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 10,
    // left: 0,
  },

  input: {
    borderRadius: 15,
    paddingHorizontal: metrics.medium,
    height: 120,
    color: 'black',
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: colors.grey200,
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
