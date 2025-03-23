import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  keyboard: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    padding: metrics.bigger,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  btnCloseModal: {
    alignSelf: 'flex-end',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
