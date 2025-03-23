import {StyleSheet} from 'react-native';
import {metrics} from '../../assets/others';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  scroll: {
    flexGrow: 1,
    backgroundColor: 'white',
  },

  content: {
    padding: metrics.small,
  },

  containerNotification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 70,
    backgroundColor: '#BBB',
  },
});
