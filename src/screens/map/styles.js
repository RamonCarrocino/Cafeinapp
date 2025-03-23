import {StyleSheet} from 'react-native';
import {colors} from '../../assets/others';

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  map: {
    flex: 1,
  },

  marker: {
    width: 20,
    height: 20,
  },

  containerMerchant: {
    padding: 15,
    borderRadius: 20,
  },

  containerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 70,
    backgroundColor: '#BBB',
    borderWidth: 2,
    borderColor: colors.secondary,
    resizeMode: 'cover',
  },

  containerButtonsMerchant: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  buttonViewProfile: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    width: 150,
  },

  inputSearch: {
    width: '95%',
    position: 'absolute',
    zIndex: 2,
    marginTop: 10,
    alignSelf: 'center',
  },

  buttonLocation: {
    width: 50,
    height: 50,
    position: 'absolute',
    zIndex: 2,
    bottom: 70,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },

  searchItem: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
  },
});
