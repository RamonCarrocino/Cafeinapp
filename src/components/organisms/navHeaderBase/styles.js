import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    zIndex: 10,
  },

  headerImage: {
    height: metrics.bigger * 1.8,
    width: '100%',
  },

  headerBar: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 35,
  },

  headerTitle: {
    color: 'white',
    textAlign: 'center',
    // marginLeft: 90,
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
  },

  containerModal: {
    // backgroundColor: 'red',
    width: '50%',
    alignSelf: 'flex-end',
    margin: 0,
    position: 'relative',
  },

  wrapperTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: metrics.small,
    paddingVertical: metrics.small,
  },

  chevron: {
    width: metrics.big,
    height: metrics.big,
  },

  btnClose: {},

  containerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  imageOption: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default styles;
