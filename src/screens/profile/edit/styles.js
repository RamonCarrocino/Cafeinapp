import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: 'white',
  },

  content: {
    backgroundColor: 'white',
    paddingHorizontal: metrics.big,

    paddingVertical: metrics.medium,
  },

  containerImageProfile: {
    position: 'relative',
  },

  containerImageCover: {
    position: 'relative',
  },

  buttonImageProfile: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },

  containerButtonCurrentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  buttonEditCurrentLocation: {},

  buttonCurrentLocation: {
    width: 450,
  },

  imageProfile: {
    width: 300,
    height: 300,
    backgroundColor: colors.grey400,
    borderRadius: 250,
    alignSelf: 'center',
  },

  imageCover: {
    width: 300,
    height: 400,
    backgroundColor: colors.grey400,
    borderRadius: 50,
    alignSelf: 'center',
  },

  containerLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  optionLabel: {
    paddingHorizontal: metrics.big,
    paddingVertical: metrics.small,
    backgroundColor: '#E8C683',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: metrics.medium,
    margin: metrics.smaller,
    // minWidth: 400,
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between',
  },
});

export default styles;
