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

  content: {
    paddingHorizontal: metrics.bigger,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'white',
    flex: 1,
  },

  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 300,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },

  containerLogo: {
    flexDirection: 'row',
  },

  logo: {
    width: 700,
    height: 250,
  },

  logoText: {
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.25)',
  },

  btnPassRecovery: {
    alignSelf: 'flex-end',
  },

  textLink: {
    textDecorationLine: 'underline',
  },

  login20Button: {
    height: 120,
    backgroundColor: colors.grey400,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },

  division: {
    width: '118%',
    left: -29,
    position: 'relative',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    alignItems: 'center',
  },

  divisionText: {
    width: 100,
    textAlign: 'center',
    bottom: -10,
    backgroundColor: 'white',
    fontSize: 45,
  },

  footer: {
    alignItems: 'center',
  },
});

export default styles;
