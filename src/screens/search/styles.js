import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  content: {
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

  input: {
    paddingHorizontal: metrics.small,
  },

  containerOptionsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: metrics.small,
  },

  optionFilter: {
    flexDirection: 'row',
    marginLeft: 60,
    alignItems: 'center',
  },
});

export default styles;
