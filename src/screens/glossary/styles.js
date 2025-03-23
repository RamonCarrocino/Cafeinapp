import {StyleSheet} from 'react-native';
import {metrics} from '../../assets/others';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    backgroundColor: 'white',
  },

  content: {
    padding: metrics.small,
  },
});
