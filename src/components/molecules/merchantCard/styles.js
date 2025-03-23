import {StyleSheet} from 'pr-unit';
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
  },

  profile: {
    flexDirection: 'row',
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

  avatar: {
    width: 170,
    height: 170,
    marginRight: 20,
    borderRadius: 100,
    backgroundColor: '#BBB',
  },

  image: {
    width: 400,
    height: 400,
    backgroundColor: colors.grey400,
    borderRadius: 37,
  },

  infos: {
    flexWrap: 'wrap',
    width: '60%',
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default styles;
