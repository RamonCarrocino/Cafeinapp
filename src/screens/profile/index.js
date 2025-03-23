import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Linking, Platform, StatusBar, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Mask} from '@tboerc/maskfy';
import {ScrollView} from 'react-native-gesture-handler';

import styles from './styles';
import {colors} from '../../assets/others';
import {api, useAuth} from '../../services';
import {NavHeaderBase} from '../../components/organisms';
import {MedalIcon, PencilIcon} from '../../assets/svg/icons';
import {Loader, Spacer, Text, Touchable} from '../../components/atoms';
import {FeedCard, ProductCard, SelectInput} from '../../components/molecules';

import MerchantHeader from './components/merchantHeader';

const WhatsApp = require('./../../assets/images/icons/whatsapp.png');
const Location = require('./../../assets/images/icons/location.png');
const Instagram = require('./../../assets/images/icons/instagram.png');

const Profile = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [switchButton, setSwitchButton] = useState(1);
  const [orderBy, setOrderBy] = useState('');
  const [grades, setGrades] = useState([]);
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState();
  const [numberRegisterNotes, setNumberRegisterNotes] = useState(0);

  const [verifiedData, setVerifiedData] = useState({});

  const [rateAmount, setRateAmount] = useState(0);

  const IS_PREVIEW = !!route?.params?.id;
  const CONSUMER_PROFILE = userData?.pv === 0;
  const MERCHANT_PROFILE = userData?.pv === 1;
  const medal = {
    5: 'Novato',
    10: 'Assíduo',
    25: 'Experiente',
    50: 'Profissional',
  };

  const handleMedal = qtdGrades => {
    if (qtdGrades < 10) {
      return medal['5'];
    } else if (qtdGrades >= 10 && qtdGrades < 25) {
      return medal['10'];
    } else if (qtdGrades >= 25 && qtdGrades < 50) {
      return medal['25'];
    } else if (qtdGrades >= 50) {
      return medal['50'];
    } else {
      console.log('erro de lógica nas medalhas');
    }
  };

  const {data: currentUser} = useAuth()[0];

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        if (CONSUMER_PROFILE) {
          const {data: resp} = await api.get(
            `/grades?onlyUser=${
              route?.params?.id || currentUser.id
            }&favoriteGrades=${switchButton === 2 ? true : false}${orderBy}
            `,
          );

          const {data: respRating} = await api.get(
            `/user/rate-amount?userId=${route?.params?.id}`,
          );

          setRateAmount(respRating.data);
          setGrades(resp.data);
          const ALL_GRADES = switchButton !== 2;
          if (ALL_GRADES) {
            setNumberRegisterNotes(resp.data.length);
          }
        } else if (MERCHANT_PROFILE) {
          const {data: resp} = await api.get(
            `/user-products?onlyUser=${
              route?.params?.id || currentUser.id
            }${orderBy}`,
          );
          setProducts(resp.data);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error ', error);
      }
    };

    getData();
  }, [orderBy, route?.params?.id, userData, switchButton]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const {data: resp} = await api.get(
            `/user/one/${route?.params?.id || currentUser.id}?followedId=${
              currentUser.id
            }`,
          );

          if (currentUser.id === resp.data.id) {
            const {data: respVerified} = await api.get(
              '/user-verifications/status',
            );
            setVerifiedData(respVerified.data);
          }

          setUserData(resp.data);
        } catch (error) {
          console.log('Error ', error);
        }
      })();
    }, [route.params]),
  );

  const LABELS_ORDER = CONSUMER_PROFILE
    ? [
        {name: 'Maior preço', id: '&orderBy=price&orderType=desc'},
        {name: 'Menor preço', id: '&orderBy=price&orderType=asc'},
        {name: 'Melhor avaliação', id: '&orderBy=rating&orderType=desc'},
        {name: 'Pior avaliação', id: '&orderBy=rating&orderType=asc'},
        {
          name: 'Publicação mais recente',

          id: '&orderBy=createdAt&orderType=desc',
        },
      ]
    : [
        {name: 'Maior preço', id: '&orderBy=price&orderType=desc'},
        {name: 'Menor preço', id: '&orderBy=price&orderType=asc'},
        {
          name: 'Publicação mais recente',

          id: '&orderBy=createdAt&orderType=desc',
        },
      ];

  const handleFollow = async id => {
    try {
      const {data: resp} = await api.post(`/user/follow?followerId=${id}`);
      setUserData({...userData, followers: [{id}]});
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const handleUnfollow = async id => {
    try {
      await api.delete(`/user/unfollow?followerId=${id}`);

      setUserData({...userData, followers: []});
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const ConsumerHeader = () => (
    <View style={styles.contentProfile}>
      {!!userData && (
        <View style={styles.profile}>
          <View style={{maxWidth: '50%'}}>
            <View style={styles.title}>
              <Text format="title"> {userData.name} </Text>
              <Spacer size="nanoWidth" />
              <Spacer size="nanoWidth" />
              {!IS_PREVIEW && (
                <Touchable
                  onPress={() => navigation.navigate('profile/edit', userData)}>
                  <PencilIcon
                    fill={CONSUMER_PROFILE ? colors.secondary : colors.primary}
                    colorPencil={MERCHANT_PROFILE && '#000'}
                  />
                </Touchable>
              )}
            </View>

            <Text>@{userData.username}</Text>
            <Spacer size="nano" />
            <View style={styles.containerTagSkills}>
              {CONSUMER_PROFILE &&
                userData.profile?.label &&
                JSON.parse(userData.profile.label).map(label => (
                  <>
                    <View key={label} style={styles.tagSkill}>
                      <Text style={styles.textTagSkill}>{label}</Text>
                    </View>
                  </>
                ))}
            </View>

            <Spacer size="smaller" />

            <View style={styles.containerFollowers}>
              <Touchable
                onPress={() =>
                  navigation.navigate('relation', {
                    type: 'followed',
                    id: userData.id,
                  })
                }>
                <View style={styles.tagFollowers}>
                  <Text style={styles.textTagFollowers}>
                    {userData._count.followeds} seguindo
                  </Text>
                </View>
              </Touchable>
              <Spacer size="nanoWidth" />
              <Touchable
                onPress={() =>
                  navigation.navigate('relation', {
                    type: 'follower',
                    id: userData.id,
                  })
                }>
                <View style={styles.tagFollowers}>
                  <Text style={styles.textTagFollowers}>
                    {userData._count.followers} seguidores
                  </Text>
                </View>
              </Touchable>
            </View>
            <Spacer size="smaller" />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {CONSUMER_PROFILE ? (
                <Text style={{flexShrink: 1}}>
                  {userData.profile?.biography}
                </Text>
              ) : (
                <>
                  {userData.profile?.location && (
                    <Touchable
                      onPress={() =>
                        userData.profile?.latitude &&
                        navigation.navigate('map', {
                          location: {
                            centerCoordinate: [
                              userData.profile?.longitude,
                              userData.profile?.latitude,
                            ],
                            zoomLevel: 17,
                          },
                        })
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 25, height: 30}}
                        source={Location}
                      />
                      <Spacer size="nanoWidth" />
                      <Text>{userData.profile?.location}</Text>
                    </Touchable>
                  )}
                </>
              )}
            </View>

            <Spacer size="smaller" />

            <View style={styles.sessionIcons}>
              {userData.profile?.instagram && (
                <>
                  <Touchable
                    onPress={() =>
                      Linking.openURL(
                        `https://www.instagram.com/${userData.profile?.instagram?.replace(
                          '@',
                          '',
                        )}`,
                      )
                    }>
                    <Image style={{width: 25, height: 25}} source={Instagram} />
                  </Touchable>

                  <Spacer size="mediumWidth" />
                </>
              )}

              {CONSUMER_PROFILE ? (
                <>
                  {userData.profile?.location && (
                    <>
                      <Image
                        style={{width: 25, height: 30}}
                        source={Location}
                      />
                      <Spacer size="nanoWidth" />

                      <Text>{userData.profile?.location}</Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  {userData.profile?.phone && (
                    <>
                      <Touchable
                        onPress={() =>
                          Linking.openURL(
                            `whatsapp://send?text=Olá!&phone=55${Mask.phone.raw(
                              userData.profile?.phone,
                            )}`,
                          )
                        }>
                        <Image
                          style={{width: 30, height: 28}}
                          source={WhatsApp}
                        />
                      </Touchable>

                      <Spacer size="nanoWidth" />
                      <Spacer size="nanoWidth" />

                      <Text>{Mask.phone.value(userData.profile.phone)}</Text>
                    </>
                  )}
                </>
              )}
            </View>

            {MERCHANT_PROFILE && (
              <>
                <Spacer size="nano" />
                <Text>{userData?.profile?.website}</Text>
              </>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <Image
              style={styles.imageProfile}
              source={{
                uri: route.params?.file?.uri || userData.profile?.avatar,
              }}
            />
            <Spacer />

            {CONSUMER_PROFILE && (
              <>
                <View style={{flexDirection: 'row'}}>
                  <MedalIcon />
                  <Spacer size="nanoWidth" />

                  <View style={styles.tagMedal}>
                    <Text style={styles.textTagMedal}>
                      {handleMedal(rateAmount)}
                    </Text>
                  </View>
                </View>
                <Text>{rateAmount} avaliações</Text>
              </>
            )}

            {currentUser.id !== userData.id && (
              <>
                <Spacer size="nano" />
                <Spacer size="nano" />
                {userData?.followers.length > 0 ? (
                  <Touchable
                    onPress={() => handleUnfollow(userData.id)}
                    style={styles.btnFollow}>
                    <Text style={styles.btnFollowText}>Parar de seguir</Text>
                  </Touchable>
                ) : (
                  <Touchable
                    onPress={() => handleFollow(userData.id)}
                    style={styles.btnFollow}>
                    <Text style={styles.btnFollowText}>Seguir</Text>
                  </Touchable>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <NavHeaderBase
            goBack={IS_PREVIEW}
            navigation={navigation}
            title={IS_PREVIEW ? 'Perfil' : 'Seu perfil'}
          />

          {CONSUMER_PROFILE ? (
            <ConsumerHeader />
          ) : (
            <MerchantHeader
              verifiedData={verifiedData}
              userData={userData}
              currentUser={currentUser}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
              route={route}
              isPreview={IS_PREVIEW}
              navigation={navigation}
            />
          )}

          <View style={styles.containerGrades}>
            {CONSUMER_PROFILE && (
              <>
                <View style={styles.containerSwitch}>
                  <Touchable
                    onPress={() => setSwitchButton(1)}
                    style={[
                      styles.switchButton,
                      switchButton === 1 && {backgroundColor: colors.primary},
                    ]}>
                    <Text style={styles.textSwitchButton}>
                      {IS_PREVIEW ? 'Avaliações' : 'Minhas notas'}
                    </Text>
                  </Touchable>

                  <Spacer size="nanoWidth" />

                  <Touchable
                    onPress={() => setSwitchButton(2)}
                    style={[
                      styles.switchButton,
                      switchButton === 2 && {backgroundColor: colors.primary},
                    ]}>
                    <Text style={styles.textSwitchButton}>Favoritos</Text>
                  </Touchable>
                </View>
                <Spacer size="small" />
              </>
            )}

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
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {CONSUMER_PROFILE && (
                  <Grades grades={grades} navigation={navigation} />
                )}
                {MERCHANT_PROFILE && (
                  <Products products={products} navigation={navigation} />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};

export default Profile;

const Grades = ({grades, navigation}) => {
  return (
    <>
      <Spacer />
      {grades.length === 0 ? (
        <Text>Sem notas</Text>
      ) : (
        grades.map((item, index) => (
          <Touchable
            key={index}
            onPress={() => navigation.navigate('grade', {gradeId: item.id})}>
            <FeedCard
              key={index.toString()}
              data={item}
              navigation={navigation}
            />
          </Touchable>
        ))
      )}

      <Spacer />
    </>
  );
};

const Products = ({products, navigation}) => {
  return (
    <>
      <Spacer />
      {products.length === 0 ? (
        <Text>Nenhum produto encontrado</Text>
      ) : (
        products.map((item, index) => (
          <Touchable
            onPress={() =>
              navigation.navigate('product', {productId: item.product.id})
            }>
            <ProductCard
              key={index.toString()}
              name={item.product.name}
              status={item.status}
              renderStatus={true}
              rating={item.avgRating}
              image={item?.product?.attachments?.[0]?.uri}
              brand={item.product.brand}
            />
          </Touchable>
        ))
      )}

      <Spacer />
    </>
  );
};
