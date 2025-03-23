import {
  Image,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import React, {useCallback, useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {InputProfile, Spacer, Text, Touchable} from '../../../components/atoms';
import {NavHeaderBase} from '../../../components/organisms';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from '../../../components/molecules';
import {PencilIcon} from '../../../assets/svg/icons';
import {colors, config, yup} from '../../../assets/others';
import {onError, onWarning} from '../../../helpers';
import {api, useAuth} from '../../../services';
import styles from './styles';
import {Mask} from '@tboerc/maskfy';
import axios from 'axios';

const EditProfile = ({navigation, route}) => {
  const user = useAuth()[0].data;

  const IS_CONSUMER = user.pv === 0;
  const IS_MERCHANT = user.pv === 1;

  const INITIAL_VALUES = {
    name: route.params?.name || user.name,
    username: route.params?.username || '',
    instagram: route.params?.profile?.instagram || '',
    label:
      (route.params?.profile?.label &&
        JSON.parse(route.params?.profile?.label)) ||
      [],
    uriImage: route.params?.profile?.avatar || '',
    coverImage: route.params?.profile?.coverImage || '',
    fileCover: '',
    file: '',
    location: route.params?.profile?.location || '',

    biography: route.params?.profile?.biography || '',

    email: route.params?.email || '',
    phone: route.params?.profile?.phone || '',
    website: route.params?.profile?.website || '',
    longitude: route.params?.profile?.longitude || '',
    latitude: route.params?.profile?.latitude || '',

    isConsumer: IS_CONSUMER,
    isMerchant: IS_MERCHANT,
  };

  useEffect(() => {
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
        // resolve();
      })
      .catch(err => {
        console.warn(err);
        // reject(err);
      });
  }, []);

  const handleUpload = async () => {
    await launchImageLibrary(
      {mediaType: 'photo', quality: 0.7, maxHeight: 500, maxWidth: 500},
      async image => {
        if (image.didCancel) {
          return false;
        }
        setFieldValue('file', {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        });
      },
    );
  };

  const handleUploadCover = async () => {
    await launchImageLibrary(
      {mediaType: 'photo', quality: 0.7, maxHeight: 500, maxWidth: 500},
      async image => {
        if (image.didCancel) {
          return false;
        }
        setFieldValue('fileCover', {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        });
      },
    );
  };

  const [location, setLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const convertToCoordinate = async e => {
    try {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${e}.json?proximity=${'-47.876968, -15.811643'}&worldview=us&access_token=${
          config.mapboxGLAccessToken
        }`,
      );

      setLocation(result.data.features);
    } catch (error) {
      console.log({message: 'Endereço não encontrado'});
    }
  };

  const onUpdate = useCallback(async ({file, fileCover, ...values}) => {
    try {
      delete values.isConsumer;
      delete values.isMerchant;
      if (values.phone) {
        values.phone = Mask.phone.raw(values.phone);
      }

      values.label = JSON.stringify(values.label);

      const formData = new FormData();

      formData.append('file', file);
      formData.append('fileCover', fileCover);
      formData.append('fields', JSON.stringify(values));

      await api.put('/user/update', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      navigation.navigate('profile', {...values, file});
      resetForm();
    } catch (error) {
      console.log(error);
      onError(error);
    }
  }, []);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    touched,
    setValues,
    errors,
    values,
    resetForm,
  } = useFormik({
    onSubmit: onUpdate,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  const currentLocationSaved = !!values?.longitude;

  const handleCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      info => {
        setValues({
          ...values,
          longitude: info.coords.longitude.toString(),
          latitude: info.coords.latitude.toString(),
        });
      },
      error =>
        onWarning({
          message: `Não foi possível obter sua localização Localização desativada ou sem permissão
      `,
        }),
    );
  };

  const handleLabels = label => {
    const existLabel = values.label.find(l => l === label);
    if (existLabel) {
      const newLabel = values.label.filter(l => l !== label);
      setFieldValue('label', newLabel);
      return;
    }

    setFieldValue('label', [...values.label, label]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <NavHeaderBase navigation={navigation} title="Editar perfil" />

          <View style={styles.content}>
            <View style={styles.row}>
              <View>
                <View style={styles.containerImageProfile}>
                  <Image
                    style={styles.imageProfile}
                    source={{
                      uri: values.file.uri || values.uriImage,
                    }}
                  />
                  <Touchable
                    style={styles.buttonImageProfile}
                    onPress={handleUpload}>
                    <PencilIcon fill={'#CC9424'} colorPencil="black" />
                  </Touchable>
                </View>
                <Text format="bodySmallBold">Imagem de perfil</Text>
              </View>

              <Spacer />
              <View>
                <View style={styles.containerImageCover}>
                  <Image
                    style={styles.imageCover}
                    source={{
                      uri: values.fileCover.uri || values.coverImage,
                    }}
                  />
                  <Touchable
                    style={styles.buttonImageProfile}
                    onPress={handleUploadCover}>
                    <PencilIcon fill={'#CC9424'} colorPencil="black" />
                  </Touchable>
                </View>

                <Text format="bodySmallBold">Imagem de capa</Text>
              </View>
            </View>

            <Spacer />

            {IS_MERCHANT && (
              <View style={styles.containerButtonCurrentLocation}>
                <Text format="labelInput"> Ponto no mapa: </Text>
                <Button
                  text="Pegar localização atual"
                  disabled={currentLocationSaved}
                  onPress={handleCurrentLocation}
                  style={styles.buttonCurrentLocation}
                  loading={loading}
                />
                <Spacer size="nanoWidth" />

                {currentLocationSaved && (
                  <Touchable
                    style={styles.editCurrentLocation}
                    onPress={() => {
                      setFieldValue('longitude', '');
                      setFieldValue('latitude', '');
                    }}>
                    <PencilIcon fill={'#CC9424'} colorPencil="black" />
                  </Touchable>
                )}
              </View>
            )}

            <Spacer size="smaller" />

            <InputProfile
              label="Nome"
              value={values.name}
              autoCapitalize="none"
              onBlur={() => handleBlur('name')}
              onChangeText={handleChange('name')}
              error={touched.name && errors.name}
              placeholder="                 "
            />
            <Spacer size="smaller" />
            <InputProfile
              label="Usuário"
              value={values.username}
              autoCapitalize="none"
              onBlur={() => handleBlur('username')}
              onChangeText={handleChange('username')}
              error={touched.username && errors.username}
              placeholder="                 "
            />
            <Spacer size="smaller" />
            <InputProfile
              label="E-mail"
              value={values.email}
              autoCapitalize="none"
              onBlur={() => handleBlur('email')}
              onChangeText={handleChange('email')}
              error={touched.email && errors.email}
              placeholder="                 "
            />
            <Spacer size="smaller" />
            {IS_MERCHANT && (
              <InputProfile
                label="Local"
                value={values.location}
                autoCapitalize="none"
                onBlur={() => {
                  handleBlur('location');
                  convertToCoordinate('');
                }}
                onChangeText={e => {
                  setFieldValue('location', e);
                  convertToCoordinate(e);
                }}
                error={touched.location && errors.location}
                placeholder="                 "
              />
            )}

            <View style={{position: 'relative', zIndex: 9999}}>
              <View style={{position: 'absolute', zIndex: 9999, width: '100%'}}>
                {location &&
                  location.map(e => (
                    <Touchable
                      onPress={() => {
                        // setFieldValue('longitude', e.center[0].toString());
                        // setFieldValue('latitude', e.center[1].toString());
                        setFieldValue('location', e.place_name);
                        setLocation(false);
                      }}
                      style={{
                        zIndex: 9999,
                        padding: 10,
                        backgroundColor: 'white',
                        width: '100%',
                        // marginBottom: 5,
                      }}>
                      <Text>{e.place_name}</Text>
                    </Touchable>
                  ))}
              </View>
            </View>

            <Spacer size="smaller" />
            <InputProfile
              label="Instagram"
              value={values.instagram}
              autoCapitalize="none"
              onBlur={() => handleBlur('instagram')}
              onChangeText={handleChange('instagram')}
              error={touched.instagram && errors.instagram}
              placeholder="seu_instagram"
            />
            <Text format="bodySmall" style={{alignSelf: 'flex-end'}}>
              Digite apenas o seu nome de usuário
            </Text>
            {IS_CONSUMER && (
              <>
                <Spacer />
                <Text style={{alignSelf: 'center'}} format="labelInput">
                  Biografia
                </Text>
                <Spacer size="smaller" />
                <InputProfile
                  styleInput={{width: '100%', height: 100, flexWrap: 'wrap'}}
                  value={values.biography}
                  autoCapitalize="none"
                  onBlur={() => handleBlur('biography')}
                  onChangeText={handleChange('biography')}
                  error={touched.biography && errors.biography}
                  placeholder="                 "
                />
                <Spacer />
                <View style={styles.containerLabels}>
                  {[
                    'Apreciador',
                    'Barista',
                    'Produtor',
                    'Torrador',
                    'Dono de cafeteria',
                  ].map((label, index) => (
                    <Touchable
                      onPress={() => handleLabels(label)}
                      style={[
                        styles.optionLabel,
                        values.label.find(l => l === label) && {
                          backgroundColor: '#CC9424',
                        },
                      ]}>
                      <Text format="labelInput">{label}</Text>
                    </Touchable>
                  ))}
                </View>
                {touched.label && errors.label && (
                  <Text style={styles.error} format="error">
                    {errors.label}
                  </Text>
                )}
              </>
            )}

            {IS_MERCHANT && (
              <>
                <Spacer size="smaller" />

                <InputProfile
                  label="Whatsapp"
                  value={values.phone}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onBlur={() => handleBlur('phone')}
                  onChangeText={e =>
                    setFieldValue('phone', Mask.phone.value(e))
                  }
                  error={touched.phone && errors.phone}
                  placeholder="                 "
                />
                <Spacer size="smaller" />

                <InputProfile
                  label="Site"
                  value={values.website}
                  autoCapitalize="none"
                  onBlur={() => handleBlur('website')}
                  onChangeText={handleChange('website')}
                  error={touched.website && errors.website}
                  placeholder="                 "
                />
              </>
            )}
            <Spacer />

            <Button
              text="Salvar"
              disabled={isSubmitting}
              onPress={handleSubmit}
              loading={isSubmitting}
            />
            <Spacer />
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://cafeinapp.com.br/deletar-minha-conta/')
              }>
              <Text color="red" align="center">
                Excluir conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const validationSchema = Yup.object({
  name: Yup.string().required(yup.required),
  email: Yup.string().email(yup.email).required(yup.required),
  username: Yup.string()
    .matches(/^\S*$/, 'Não pode conter espaços em branco')
    .required(yup.required),
  location: Yup.string(),
  instagram: Yup.string(),
  isConsumer: Yup.boolean(),
  isMerchant: Yup.boolean(),
  label: Yup.array().when('isConsumer', {
    is: true,
    then: Yup.array().required(yup.required),
  }),
  biography: Yup.string().when('isConsumer', {
    is: true,
    then: Yup.string(),
  }),
  phone: Yup.string().when('isMerchant', {
    is: true,
    then: Yup.string(),
  }),
  website: Yup.string().when('isMerchant', {
    is: true,
    then: Yup.string(),
  }),
  // file: Yup.object().required(yup.required),
});
export default EditProfile;
