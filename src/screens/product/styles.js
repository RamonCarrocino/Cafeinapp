import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
    paddingHorizontal: metrics.small,
    backgroundColor: 'white',
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    backgroundColor: 'white',
  },

  header: {
    backgroundColor: colors.secondary,
  },

  headerBar: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 35,
  },

  containerProfile: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  containerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pencil: {
    width: 100,
    height: 100,
  },

  profile: {
    flexDirection: 'row',
  },

  avatar: {
    width: 130,
    height: 130,
    marginRight: 20,
    borderRadius: 70,
    backgroundColor: '#BBB',
  },

  sessionImage: {
    alignItems: 'center',
  },

  image: {
    width: 600,
    height: 600,
    backgroundColor: colors.grey400,
    borderRadius: 37,
    borderWidth: 10,
    borderColor: colors.secondary,
  },

  info: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  label: {
    fontSize: 50,
  },

  imageLevel: {
    width: 90,
    height: 90,
    marginRight: 6,
    resizeMode: 'contain',
  },

  selectLevelCoffee: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelCoffee: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  lineLevel: {
    backgroundColor: 'black',
    height: 5,
    width: '100%',
    position: 'absolute',
    top: 5,
    left: 0,
    zIndex: 0,
  },

  //rating
  constainerRatings: {},

  rating: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.primary,
    padding: metrics.small,
    borderRadius: 37,
    marginBottom: metrics.small * 1.5,
  },

  ratingProfile: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarRating: {
    width: 120,
    height: 120,
    marginRight: 20,
    backgroundColor: colors.grey400,
    borderRadius: 60,
  },

  avatarMerchant: {
    width: 180,
    height: 180,
    backgroundColor: colors.grey400,
    borderRadius: 90,
  },

  ratingComment: {
    flex: 1,
  },

  buttonComment: {
    width: 500,
    color: 'black',
    fontWeight: 900,
    alignSelf: 'center',
    borderWidth: 3,
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },

  greenBox: {
    backgroundColor: colors.lightGreen,
    padding: metrics.medium,
    borderRadius: 37,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  viewBoxTitle: {
    borderRadius: 37,
    backgroundColor: colors.secondary,
    padding: metrics.smaller,
    paddingHorizontal: metrics.medium,
    position: 'absolute',
    top: -18,
    left: 18,
  },

  boxTitle: {
    color: 'white',
  },

  viewFilterButtons: {
    flexDirection: 'row',
  },

  btnFilter: {
    flex: 1,
    borderRadius: 37,
    alignItems: 'center',
    padding: metrics.smaller,
    paddingHorizontal: metrics.medium,
  },

  viewLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default styles;
