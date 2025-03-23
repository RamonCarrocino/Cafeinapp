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

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 250,
  },

  labelFilter: {fontWeight: 'bold', textAlign: 'center'},

  filterItem: {
    width: '100%',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 5,
    paddingVertical: 40,
  },

  containerOptionsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
    marginTop: 30,
  },

  optionFilter: {
    flexDirection: 'row',
    marginLeft: 60,
    alignItems: 'center',
  },

  containerRelation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 3,
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: '#BBB',
  },

  buttonRelation: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default styles;
