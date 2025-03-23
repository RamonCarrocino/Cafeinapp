import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    margin: metrics.small,
    borderRadius: 20,
    backgroundColor: colors.grey200,
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 20,
  },

  overlay: {
    flexDirection: 'column',
    borderRadius: 20,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000050',
    padding: 30,
    justifyContent: 'space-between',
  },
});

export default styles;
