import React, {useContext, useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Image, Linking, TouchableOpacity, View} from 'react-native';
// import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

import styles from './styles';
import {Touchable, Text} from '../../atoms';
import {colors} from '../../../assets/others';
import {Context, api} from '../../../services';
import {TabBar as TabBarIcons} from '../../../assets/svg/icons';

let LABELS = ['Home', 'Buscar', 'Nota', 'Mapa', 'Perfil'];

const TabBar = React.memo(({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();
  const [globalState] = useContext(Context);

  const {data} = globalState || {};

  // admob or internal
  const [bannerOrigin, setBannerOrigin] = useState(null);
  const [banner, setBanner] = useState({});

  const onClickBanner = async () => {
    try {
      api.post('/banner/interaction', {
        bannerId: banner.id,
        type: 1,
      });

      Linking.openURL(banner.link);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getBanner = async () => {
      try {
        const {data: settings} = await api.get('/settings');

        if (settings.data.bannerOrigin === 1) {
          const {data: resp} = await api.get('/banner/app');

          setBanner(resp.data);
          setBannerOrigin('internal');
        } else {
          setBannerOrigin('admob');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBanner();
  }, []);

  return (
    <>
      <View style={[styles.spacer, {marginBottom: insets.bottom}]} />
      <View
        style={[
          styles.tab,
          {
            bottom:
              bannerOrigin === 'admob' ||
              (bannerOrigin === 'internal' && banner.id)
                ? 60
                : 0,
          },
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key],
            isFocused = state.index === index;

          const Icon = TabBarIcons[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Touchable
              onPress={onPress}
              key={index.toString()}
              style={[styles.touchable]}
              accessibilityRole="button"
              testID={options.tabBarTestID}
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}>
              <Icon
                style={styles.icon}
                fill={isFocused ? colors.primary : colors.secondary}
                permissionLevel={+data.permissionLevel}
              />

              <Text
                format="bodySmall"
                style={[
                  styles.label,
                  {color: isFocused ? colors.secondary : 'white'},
                ]}>
                {LABELS[index]}
              </Text>
            </Touchable>
          );
        })}
      </View>

      {bannerOrigin === 'admob' ? (
        // <View style={styles.banner}>
        //   <BannerAd
        //     unitId={'ca-app-pub-4532649455566732/9555180641'}
        //     size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        //     requestOptions={{
        //       requestNonPersonalizedAdsOnly: true,
        //     }}
        //   />
        // </View>
        <></>
      ) : bannerOrigin === 'internal' && banner.id ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClickBanner}
          style={styles.internalBanner}>
          <Image
            source={{uri: banner.uri}}
            resizeMode="cover"
            style={{flex: 1, height: '100%', width: '100%'}}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {/* <View style={[styles.spacer, {marginBottom: insets.bottom}]} />
      <View style={[styles.tab, {paddingBottom: insets.bottom}]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key],
            isFocused = state.index === index;

          const Icon = TabBarIcons[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Touchable
              onPress={onPress}
              key={index.toString()}
              style={[styles.touchable]}
              accessibilityRole="button"
              testID={options.tabBarTestID}
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}>
              <Icon
                style={styles.icon}
                fill={isFocused ? colors.primary : colors.secondary}
                permissionLevel={+data.permissionLevel}
              />

              <Text
                format="bodySmall"
                style={[
                  styles.label,
                  {color: isFocused ? colors.secondary : 'white'},
                ]}>
                {LABELS[index]}
              </Text>
            </Touchable>
          );
        })}
      </View> */}
    </>
  );
});

export default props => <TabBar {...props} />;
