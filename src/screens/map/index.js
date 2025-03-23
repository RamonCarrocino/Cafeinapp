import MapView, {Marker} from 'react-native-maps';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Linking,
  PermissionsAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';

import {colors, config} from '../../assets/others';
import AVATAR from './../../assets/images/avatar.png';
import {NavHeaderBase} from '../../components/organisms';
import {MapSearchInput, Spacer, Text, Touchable} from '../../components/atoms';

import {styles} from './styles';
import {api} from '../../services';
import {onError, onWarning} from '../../helpers';
import {ModalBase} from '../../components/molecules';
import {IconLocation, MapPointIcon} from '../../assets/svg/icons';

export default function Map({navigation, route}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [merchants, setMerchants] = useState([]);
  const [location, setLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [locationOptions, setLocationOptions] = useState([]);

  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const handleCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      info => {
        setCurrentLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        setLocation({
          centerCoordinate: [info.coords.longitude, info.coords.latitude],
          zoomLevel: 16,
        });
      },
      error =>
        onWarning({
          message: `Não foi possível obter sua localização Localização desativada ou sem permissão
      `,
        }),
    );
  };

  const findLocation = async search => {
    try {
      const {data: resp} = await api.get(`/profile-search?search=${search}`);

      setLocationOptions(resp.data);
    } catch (error) {
      onError(error);
    }
  };

  const locationFromProfile = route?.params?.location
    ? route.params.location
    : false;

  useEffect(() => {
    (async () => {
      setLocation(locationFromProfile);
    })();
  }, [route.params]);

  useEffect(() => {
    (async () => {
      const {data: resp} = await api.get('/merchant/map');
      setMerchants(resp.data);
    })();

    PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ],
      {
        title: 'Give Location Permission',
        message: 'App needs location permission to find your position.',
      },
    )
      .then(granted => {
        console.log(granted);
        handleCurrentLocation();
        // resolve();
      })
      .catch(err => {
        console.warn(err);
        // reject(err);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <ModalBase
          isVisible={isOpenModal}
          setIsVisible={setIsOpenModal}
          position="map">
          <View>
            <ProfileCard
              item={selectedMerchant}
              navigation={navigation}
              setIsOpenModal={setIsOpenModal}
            />
          </View>
        </ModalBase>

        <NavHeaderBase
          navigation={navigation}
          title="Buscar locais"
          goBack={false}
        />
        <View style={styles.page}>
          <View style={styles.container}>
            <View style={styles.inputSearch}>
              <MapSearchInput
                placeholder="Nome do local"
                onChangeText={value => value.length > 2 && findLocation(value)}
                // onPress={findLabel}
              />
              <Spacer size="nano" />
              {!!locationOptions.length &&
                locationOptions.map((item, index) => (
                  <Touchable
                    key={index}
                    style={styles.searchItem}
                    onPress={() => {
                      if (item.longitude && item.latitude) {
                        // setLocation({
                        //   centerCoordinate: [
                        //     parseFloat(item.longitude),
                        //     parseFloat(item.latitude),
                        //   ],
                        //   zoomLevel: 16,
                        // });
                        setCurrentLocation({
                          latitude: parseFloat(item.latitude),
                          longitude: parseFloat(item.longitude),
                        });
                      }
                      setLocationOptions([]);
                    }}>
                    <Text>{item.user?.name + ' - ' + item.location}</Text>
                  </Touchable>
                ))}
            </View>

            <Touchable
              style={styles.buttonLocation}
              onPress={handleCurrentLocation}>
              <IconLocation />
            </Touchable>

            <MapView
              provider="google"
              googleMapId="6dac1b85043bbda4"
              style={styles.map}
              region={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              {!!merchants.length &&
                merchants.map((item, index) => {
                  const avatar =
                    item?.profile?.avatar ||
                    'https://cdn-icons-png.flaticon.com/512/11450/11450005.png';
                  return (
                    item.profile.longitude &&
                    item.profile.latitude && (
                      <Marker
                        style={{zIndex: item.featured ? 9999 : 1}}
                        tracksViewChanges={item.featured}
                        pinColor="black"
                        onPress={() => {
                          setIsOpenModal(true);
                          setSelectedMerchant(item);
                        }}
                        coordinate={{
                          latitude: parseFloat(item.profile.latitude),
                          longitude: parseFloat(item.profile.longitude),
                        }}>
                        {item.featured ? (
                          <>
                            <Image
                              style={styles.avatar}
                              source={{
                                uri: avatar,
                              }}
                            />
                          </>
                        ) : (
                          <MapPoint
                            name="location-pin"
                            size={30}
                            color="black"
                          />
                        )}
                      </Marker>
                    )
                  );
                })}
            </MapView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const MapPoint = ({color = '#9F150C', size = 30}) => {
  return (
    <View style={{width: size, height: size}}>
      <MapPointIcon fill={color} />
    </View>
  );
};

const ProfileCard = ({item, navigation, setIsOpenModal}) => {
  return (
    <View style={styles.containerMerchant}>
      <View style={styles.containerProfile}>
        <View style={{flexDirection: 'row'}}>
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
          <View>
            {item.featured && (
              <Text format="bodySmallBold" color={colors.secondary}>
                Patrocinado
              </Text>
            )}
            <Text format="labelInput">{item?.name}</Text>
            <Text>{'@' + item?.username}</Text>
          </View>
        </View>
      </View>
      <Spacer size="smaller" />
      <Text>{item.profile.location}</Text>
      <Spacer size="smaller" />

      <View style={styles.containerButtonsMerchant}>
        <Touchable
          style={styles.buttonViewProfile}
          onPress={() => {
            setIsOpenModal(false);
            navigation.navigate('profileView', {id: item.id});
          }}>
          <Text format="bodyBold">Ver Perfil</Text>
        </Touchable>
        <Spacer size="mediumWidth" />
        <Touchable
          style={styles.buttonViewProfile}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${item.profile.latitude},${item.profile.longitude}`,
            )
          }>
          <Text format="bodyBold">Encontrar rota</Text>
        </Touchable>
      </View>
    </View>
  );
};
