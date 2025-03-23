import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  keyboard: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    backgroundColor: colors.primary,
  },

  containerTerms: {
    height: 700,
    borderWidth: 3,
    borderColor: '#E9E9E9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },

  scrollTerms: {},

  content: {
    paddingHorizontal: metrics.bigger,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'white',
    flex: 1,
  },

  main: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioBtn: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 3,

    marginRight: 10,
  },

  footer: {
    // backgroundColor: 'red',
  },

  checkbox: {
    alignSelf: 'center',
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },
});

export default styles;
