import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useCallback, useEffect} from 'react';
import {
  StatusBar,
  View,
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native';

import styles from './styles';
import {api} from '../../services';
import {colors} from './../../assets/others/index';
import {FeedCardAlt} from '../../components/molecules';
import {NavHeaderBase} from '../../components/organisms';
import {Loader, Text, Spacer, Touchable} from '../../components/atoms';

const Home = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const columns = [[], []];
  let heights = [0, 0];
  feed.forEach((item, index) => {
    const height = index % 2 === 0 ? 200 : 300;
    const columnIndex = heights[0] <= heights[1] ? 0 : 1;
    columns[columnIndex].push({...item, height});
    heights[columnIndex] += height;
  });

  const getData = async () => {
    try {
      setIsLoading(true);
      const {data: resp} = await api.get('/feed');

      setFeed(resp.data);
      // setGrades(resp.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('Error ', error);
    }
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    wait(1500).then(() => {
      setRefreshing(false);
      getData();
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <NavHeaderBase navigation={navigation} title="Início" goBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isLoading ? (
          <Loader />
        ) : feed.length > 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            {columns.map((column, columnIndex) => (
              <View key={columnIndex} style={{flex: 1}}>
                {column.map(item => (
                  <FeedCardAlt
                    key={item.id}
                    data={item}
                    navigation={navigation}
                  />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Text align="center">
              Nada encontrado. Tente atualizar o feed para encontrar as
              novidades do app.
            </Text>
            <Spacer size="xs" />
            <Touchable
              style={{
                padding: 5,
                backgroundColor: colors.primary,
                borderRadius: 2,
              }}
              onPress={onRefresh}>
              <Text>Atualizar feed</Text>
            </Touchable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
