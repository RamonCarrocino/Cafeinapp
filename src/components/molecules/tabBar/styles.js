import {StyleSheet} from 'pr-unit';

import {metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  tab: {
    bottom: 60,
    position: 'absolute',
    flexDirection: 'row',
    width: '_' + metrics.width(),
    backgroundColor: 'white',
  },

  touchable: {
    flex: 1,
    height: 185,
    alignItems: 'center',
    justifyContent: 'center',
  },

  spacer: {
    height: 90,
    backgroundColor: 'white',
  },

  icon: {
    width: 62,
    height: 62,
    marginBottom: 10,
  },

  label: {
    marginTop: 5,
    fontSize: 30,
  },

  banner: {
    backgroundColor: 'white',
  },

  internalBanner: {
    backgroundColor: 'white',
    width: '100%',
    height: 165,
  },
});

export default styles;
