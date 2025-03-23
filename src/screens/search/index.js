import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useEffect, useCallback} from 'react';
import {
  StatusBar,
  View,
  RefreshControl,
  Platform,
  FlatList,
} from 'react-native';

import {
  FeedCard,
  MerchantCard,
  ProductCard,
  SelectInput,
} from '../../components/molecules';
import {NavHeaderBase} from '../../components/organisms';
import {api} from '../../services';
import styles from './styles';
import {
  Loader,
  Text,
  Spacer,
  Touchable,
  SearchInput,
} from '../../components/atoms';

const Search = ({navigation, route: {params}}) => {
  const {typeFilter: typeFilterParams} = params || {};

  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [products, setProducts] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const [filter, setFilter] = useState('');
  const [orderBy, setOrderBy] = useState('&orderBy=createdAt&orderType=desc');
  const [typeFilter, setTypeFilter] = useState(typeFilterParams || 'products');
  const [refreshing, setRefreshing] = useState(false);

  const getData = async type => {
    try {
      setIsLoading(true);

      if (type === 'grades') {
        const {data: resp} = await api.get(
          `/grades?${orderBy}${filter && `&search=${filter}`}`,
        );
        setGrades(resp.data);
        setIsLoading(false);

        return;
      } else if (type === 'products') {
        const {data: resp} = await api.get(
          `/products?${orderBy}&query=${filter}&status=1`,
        );

        setProducts(resp.data);
        setIsLoading(false);

        return;
      } else if (type === 'merchants') {
        const {data: resp} = await api.get(`/merchant?query=${filter}`);
        setMerchants(resp.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error ', error);
    }
  };

  useEffect(() => {
    getData(typeFilter);
  }, [orderBy, filter]);

  const LABELS_FILTER = [
    {name: 'Notas', id: 'grades'},
    {name: 'Cafés', id: 'products'},
    {name: 'Empresas', id: 'merchants'},
  ];

  const LABELS_ORDER =
    typeFilter === 'products'
      ? [
          // {name: 'Maior preço', id: '&orderBy=price&orderType=desc'},
          // {name: 'Menor preço', id: '&orderBy=price&orderType=asc'},
          {
            name: 'Publicação mais recente',

            id: '&orderBy=createdAt&orderType=desc',
          },
          {
            name: 'Publicação mais antiga',

            id: '&orderBy=createdAt&orderType=asc',
          },
        ]
      : [
          {name: 'Maior preço', id: '&orderBy=price&orderType=desc'},
          {name: 'Menor preço', id: '&orderBy=price&orderType=asc'},
          {name: 'Melhor avaliação', id: '&orderBy=rating&orderType=desc'},
          {name: 'Pior avaliação', id: '&orderBy=rating&orderType=asc'},
          {
            name: 'Publicação mais recente',

            id: '&orderBy=createdAt&orderType=desc',
          },
        ];

  const searchType = {
    grades: (
      <Grades
        navigation={navigation}
        grades={grades}
        isLoading={isLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    products: (
      <Products
        navigation={navigation}
        products={products}
        isLoading={isLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    merchants: (
      <Merchants
        navigation={navigation}
        merchants={merchants}
        isLoading={isLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    if (typeFilterParams) {
      setTypeFilter(typeFilterParams);
    }
  }, [typeFilterParams]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    wait(1500).then(() => {
      setRefreshing(false);
      getData(typeFilter);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <NavHeaderBase navigation={navigation} title="Pesquisa" />

      <Spacer size="smaller" />

      <View style={styles.input}>
        <SearchInput value={filter} onChangeText={e => setFilter(e)} />
      </View>

      <Spacer size="smaller" />

      <View style={styles.containerOptionsFilter}>
        <SelectInput
          key="selectTypeFilter"
          style={styles.optionFilter}
          options={LABELS_FILTER}
          value={typeFilter}
          placeholder="Filtrar"
          onChange={value => {
            setTypeFilter(value);
            getData(value);
          }}
        />

        {typeFilter !== 'merchants' && (
          <SelectInput
            key="selectOrderBy"
            style={styles.optionFilter}
            options={LABELS_ORDER}
            value={orderBy}
            placeholder="Ordenar"
            onChange={value => {
              setTimeout(() => setOrderBy(value), 500);
            }}
          />
        )}
      </View>

      <Spacer size="smaller" />
      <View style={styles.content}>{searchType[typeFilter || 'grades']}</View>
    </SafeAreaView>
  );
};

export default Search;

const Grades = ({navigation, grades, isLoading, refreshing, onRefresh}) => {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text align="center">Sem notas</Text>}
          data={grades}
          renderItem={({item}) => (
            <Touchable
              onPress={() => navigation.navigate('grade', {gradeId: item.id})}>
              <FeedCard
                key={item.id.toString()}
                data={item}
                navigation={navigation}
              />
            </Touchable>
          )}
        />
      )}
    </>
  );
};

const Products = ({navigation, products, isLoading, refreshing, onRefresh}) => {
  let viewedItems = [];

  const onViewableItemsChanged = React.useCallback(info => {
    const idsToSend = [];

    info.changed
      .filter(({item}) => item.featured)
      .map(({item}) => {
        const viewed = !!viewedItems.find(vi => +vi === +item.id);
        if (!viewed) {
          idsToSend.push(item.id);
        }
      });

    if (idsToSend.length > 0) {
      console.log('ENVIAR PRA API -> ', idsToSend);
      api.post('/product/interaction', {products: idsToSend, type: 0});
    }

    const newitems = [...viewedItems, ...idsToSend];

    viewedItems = newitems;
  }, []);

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 20,
    minimumViewTime: 1000,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewableItemsChanged}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text align="center">Nenhum produto disponível</Text>
          }
          data={products}
          renderItem={({item}) => (
            <Touchable
              onPress={() => {
                navigation.navigate('product', {productId: item.id});
                if (item.featured) {
                  api.post('/product/interaction', {
                    products: [item.id],
                    type: 1,
                  });
                }
              }}>
              <ProductCard
                key={item.id.toString()}
                featured={item.featured}
                name={item.name}
                rating={item.avgRating}
                image={item?.attachments?.[0]?.uri}
                brand={item.brand}
              />
            </Touchable>
          )}
        />
      )}
    </>
  );
};

const Merchants = ({
  navigation,
  merchants,
  isLoading,
  refreshing,
  onRefresh,
}) => {
  let viewedItems = [];

  const onViewableItemsChanged = React.useCallback(info => {
    const idsToSend = [];

    info.changed
      .filter(({item}) => item.featured)
      .map(({item}) => {
        const viewed = !!viewedItems.find(vi => +vi === +item.id);
        if (!viewed) {
          idsToSend.push(item.id);
        }
      });

    if (idsToSend.length > 0) {
      console.log('ENVIAR PRA API -> ', idsToSend);
      api.post('/user/interaction', {users: idsToSend, type: 0});
    }

    const newitems = [...viewedItems, ...idsToSend];

    viewedItems = newitems;
  }, []);

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 20,
    minimumViewTime: 1000,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={onViewableItemsChanged}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text align="center">Nenhum estabelecimento disponível</Text>
            }
            data={merchants}
            renderItem={({item}) => (
              <Touchable
                onPress={() => {
                  navigation.navigate('profileView', {id: item.id});
                  if (item.featured) {
                    api.post('/user/interaction', {users: [item.id], type: 1});
                  }
                }}>
                <MerchantCard
                  key={item.id.toString()}
                  data={item}
                  navigation={navigation}
                />
              </Touchable>
            )}
          />
        </>
      )}
    </>
  );
};
