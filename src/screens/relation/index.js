import {StatusBar, View, ScrollView, Image, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';

import {NavHeaderBase} from '../../components/organisms';
import AVATAR from './../../assets/images/avatar.png';
import {api, useAuth} from '../../services';
import styles from './styles';
import {
  Loader,
  Text,
  Spacer,
  Touchable,
  SearchInput,
} from '../../components/atoms';

const Relation = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [relations, setRelations] = useState([]);
  const [filter, setFilter] = useState('');
  // 'followed' | 'follower'
  const type = route.params.type;

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        if (type === 'followed') {
          const {data: resp} = await api.get(
            `/user/relations/${route.params.id}?type=${type}${
              filter && `&search=${filter}`
            }`,
          );
          setRelations(resp.data.followeds);
        } else {
          const {data: resp} = await api.get(
            `/user/relations/${route.params.id}?type=${type}${
              filter && `&search=${filter}`
            }`,
          );

          setRelations(resp.data.followers);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error ', error);
      }
    };

    getData();
  }, [filter, type]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <NavHeaderBase
          navigation={navigation}
          title={type === 'followed' ? 'Seguindo' : 'Seguidores'}
        />
        <View style={styles.content}>
          <Spacer size="smaller" />

          <SearchInput value={filter} onChangeText={e => setFilter(e)} />

          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Spacer />
              {relations.length === 0 ? (
                <Text>Sem relações</Text>
              ) : (
                relations.map((item, index) =>
                  type === 'followed' ? (
                    <FollowedCard
                      navigation={navigation}
                      item={item.followerUser}
                      setRelations={setRelations}
                      relationId={route.params.id}
                    />
                  ) : (
                    <FollowerCard
                      navigation={navigation}
                      item={item.followedUser}
                    />
                  ),
                )
              )}

              <Spacer />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Relation;

const FollowedCard = ({item, setRelations, relationId, navigation}) => {
  const currentUser = useAuth()[0].data;

  const handleUnfollow = async id => {
    try {
      await api.delete(`/user/unfollow?followerId=${id}`);

      setRelations(prev => prev.filter(item => item.followerUser.id !== id));
    } catch (error) {
      console.log('Error ', error);
    }
  };

  return (
    <Touchable
      style={styles.containerRelation}
      onPress={() => navigation.navigate('profileView', {id: item.id})}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image
          style={styles.avatar}
          source={
            item?.profile?.avatar
              ? {
                  uri: item?.profile?.avatar,
                }
              : AVATAR
          }
        />

        <Spacer size="nanoWidth" />

        <View style={{flex: 1}}>
          <Text format="labelInput">{item?.name}</Text>
          <Text>{'@' + item?.username}</Text>
        </View>
      </View>

      {currentUser.id === relationId ? (
        <Touchable
          onPress={() => handleUnfollow(item.id)}
          style={styles.buttonRelation}>
          <Text>Remover</Text>
        </Touchable>
      ) : (
        <Touchable style={[styles.buttonRelation, {opacity: 0.3}]}>
          <Text>Remover</Text>
        </Touchable>
      )}
    </Touchable>
  );
};

const FollowerCard = ({item, navigation}) => {
  return (
    <Touchable
      style={styles.containerRelation}
      onPress={() => navigation.navigate('profileView', {id: item.id})}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image
          style={styles.avatar}
          source={
            item?.profile?.avatar
              ? {
                  uri: item?.profile?.avatar,
                }
              : AVATAR
          }
        />

        <Spacer size="nanoWidth" />
        <View style={{flex: 1}}>
          <Text format="labelInput">{item?.name}</Text>
          <Text>{'@' + item?.username}</Text>
        </View>
      </View>

      <Touchable style={styles.buttonRelation}>
        <Text>Seguidor</Text>
      </Touchable>
    </Touchable>
  );
};
