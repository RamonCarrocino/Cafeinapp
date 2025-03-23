import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  flatList: {
    flexGrow: 1,
    padding: 30,
  },

  content: {
    paddingHorizontal: metrics.small,
    backgroundColor: 'white',
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
});

export default styles;
