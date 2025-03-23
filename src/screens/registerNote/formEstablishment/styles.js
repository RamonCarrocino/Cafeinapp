import {StyleSheet} from 'pr-unit';

import {colors, metrics} from '../../../assets/others';

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

  boxInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },

  selectButton: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderRadius: 40,
    padding: 30,
    marginLeft: 10,
    opacity: 0.8,
  },

  shadowProp: {
    opacity: 1,
    backgroundColor: colors.secondary,
  },

  // level

  containerLevel: {
    width: '57%',
  },
  containerLevelMilling: {
    width: '70%',
  },

  imageLevel: {
    width: 90,
    height: 90,
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

  methodCoffee: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },

  imageMethod: {
    width: 90,
    height: 90,
  },

  boxSlider: {
    flexDirection: 'row',
  },

  labelsMillings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 10,
  },

  buttonsFooter: {
    justifyContent: 'space-between',
  },

  containerButtonAnnex: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonAnnex: {
    width: 150,
    height: 150,
    borderRadius: 70,
    marginRight: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSave: {
    width: 300,
    color: 'black',
    fontWeight: 900,
    alignSelf: 'center',
  },

  buttonReset: {
    width: 350,
    color: 'black',
    fontWeight: 900,
    alignSelf: 'center',
    marginRight: metrics.medium,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  image: {
    width: 300,
    height: 300,
    backgroundColor: colors.grey400,
    borderRadius: 37,
  },

  modalBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  viewProduct: {
    alignItems: 'center',
    width: '45%',
  },
});

export default styles;
