import React from 'react';
import {Mask} from '@tboerc/maskfy';
import {Image, Linking, View} from 'react-native';

import styles from './styles';
import {colors} from '../../../../assets/others';
import {Alert} from '../../../../assets/svg/icons';
import {
  Spacer,
  SpacerHorizontal,
  Text,
  Touchable,
} from '../../../../components/atoms';

const WhatsApp = require('./../../../../assets/images/icons/whatsapp.png');
const Location = require('./../../../../assets/images/icons/location.png');
const Instagram = require('./../../../../assets/images/icons/instagram.png');
const Website = require('./../../../../assets/images/icons/website.png');

const MerchantHeader = ({
  userData,
  currentUser,
  handleFollow,
  handleUnfollow,
  route,
  isPreview,
  navigation,
  verifiedData,
}) => (
  <View>
    <View style={styles.contentProfile}>
      {!!userData && (
        <View style={styles.profile}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.imageProfile}
              source={{
                uri: route.params?.file?.uri || userData.profile?.avatar,
              }}
            />

            {currentUser.id !== userData.id && (
              <>
                <Spacer size="nano" />
                <Spacer size="nano" />
                {userData?.followers.length > 0 ? (
                  <Touchable
                    onPress={() => handleUnfollow(userData.id)}
                    style={styles.btnFollow}>
                    <Text format="small" style={styles.btnFollowText}>
                      Parar de seguir
                    </Text>
                  </Touchable>
                ) : (
                  <Touchable
                    onPress={() => handleFollow(userData.id)}
                    style={styles.btnFollow}>
                    <Text format="small" style={styles.btnFollowText}>
                      Seguir
                    </Text>
                  </Touchable>
                )}
              </>
            )}
          </View>

          <SpacerHorizontal size="xs" />

          <View style={{flex: 1}}>
            <View style={styles.title}>
              <View style={styles.row}>
                <Text format="bodyBold">{userData.name}</Text>

                <SpacerHorizontal size="nano" />

                <Image
                  style={[
                    styles.verifiedIcon,
                    !userData.verified && {
                      tintColor: colors.grey400,
                    },
                  ]}
                  source={require('./../../../../assets/images/icons/verified.png')}
                />
              </View>

              <SpacerHorizontal />

              {!isPreview && (
                <Touchable
                  onPress={() => navigation.navigate('profile/edit', userData)}>
                  <Image
                    style={styles.pencilIcon}
                    source={require('./../../../../assets/images/icons/updateProfilePencil.png')}
                  />
                </Touchable>
              )}
            </View>

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
                    <Image style={{width: 30, height: 28}} source={WhatsApp} />
                  </Touchable>
                </>
              )}
            </View>

            <Spacer size="nano" />

            <Text format="small">@{userData.username}</Text>

            <Spacer size="xs" />

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

            {userData.profile?.location && (
              <Touchable
                style={{flexDirection: 'row', alignItems: 'center'}}
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
                }>
                <Image
                  style={{width: 18, height: 25, resizeMode: 'contain'}}
                  source={Location}
                />
                <Spacer size="nanoWidth" />
                <Text format="small">{userData.profile?.location}</Text>
              </Touchable>
            )}

            <Spacer size="nano" />

            {userData.profile?.website && (
              <Touchable
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => Linking.openURL(userData.profile?.website)}>
                <Image
                  style={{width: 18, height: 25, resizeMode: 'contain'}}
                  source={Website}
                />
                <Spacer size="nanoWidth" />
                <Text format="small">{userData?.profile?.website}</Text>
              </Touchable>
            )}
          </View>
        </View>
      )}
    </View>

    {currentUser.id === userData?.id && !userData.verified && (
      <Touchable
        disabled={verifiedData?.status === 0}
        style={[
          styles.verifyAlert,
          verifiedData?.status === 2 && {backgroundColor: 'red'},
        ]}
        onPress={() => navigation.navigate('requestVerification')}>
        <Alert />

        <SpacerHorizontal size="xs" />

        {verifiedData?.status === 2 ? (
          <View>
            <Text format="small" color="white" style={{flex: 1}}>
              A verificação de perfil foi reprovada.
            </Text>
            <Text format="bodySmallBold" color="white" style={{flex: 1}}>
              Motivo: {verifiedData?.reprovalReason}
            </Text>
            <Text format="small" color="white" style={{flex: 1}}>
              Clique aqui para tentar novamente.
            </Text>
          </View>
        ) : verifiedData?.status === 0 ? (
          <Text format="small" color="white" style={{flex: 1}}>
            Sua solicitação de verificação está em análise
          </Text>
        ) : (
          <Text format="small" color="white" style={{flex: 1}}>
            Seu perfil ainda não foi verificado. Clique aqui e verifique agora
            mesmo!
          </Text>
        )}
      </Touchable>
    )}
  </View>
);

export default MerchantHeader;
