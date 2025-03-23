import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },

  content: {
    flex: 1,
    padding: metrics.medium,
    backgroundColor: '#FAF9F8',
  },

  scroll: {
    flexGrow: 1,
    backgroundColor: 'white',
  },

  btnDocument: {
    borderWidth: 4,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    padding: 30,
    paddingVertical: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  error: {
    paddingHorizontal: 20,
    color: colors.red,
  },
});

export default styles;
