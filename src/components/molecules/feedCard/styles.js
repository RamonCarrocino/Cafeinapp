import {StyleSheet} from 'pr-unit';
import {color} from 'react-native-reanimated';
import {colors, metrics} from '../../../assets/others';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    backgroundColor: '#FFFDFA',
    borderRadius: 13,
    marginBottom: metrics.medium,
    marginHorizontal: metrics.small,
    alignItems: 'center',
  },

  elevation: {
    elevation: 10,
    shadowColor: '#969696',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 70,
    backgroundColor: '#BBB',
  },

  image: {
    width: 220,
    height: 220,
    backgroundColor: colors.grey400,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: colors.grey400,
  },

  infos: {
    flex: 1,
    width: '60%',
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 45,
  },

  subtitle: {
    fontSize: 35,
  },
});

export default styles;
