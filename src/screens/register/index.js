import * as Yup from 'yup';
import {useFormik} from 'formik';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback, useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import {
  GraphRequest,
  GraphRequestManager,
  LoginButton,
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';

import styles from './styles';
import {actions} from '../../state';
import {api, Context} from '../../services';
import {onError, storage} from '../../helpers';
import {Button} from '../../components/molecules';
import {colors, config, yup} from '../../assets/others';
import {
  Text,
  Input,
  PasswordInput,
  Spacer,
  Touchable,
} from '../../components/atoms';
import {Apple, Facebook, Google} from '../../assets/svg/icons';

const INITIAL_VALUES = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Register = ({navigation, route}) => {
  const [, globalDispatch] = useContext(Context);

  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const onRegister = useCallback(
    async values => {
      try {
        values.pv = route.params.accountType;
        delete values.confirmPassword;
        await api.post('/user/create', values);
        navigation.navigate('login');
      } catch (error) {
        onError(error);
        onError(error);
      }
    },

    [route.params.accountType],
  );

  const onRegisterSocial = useCallback(
    async values => {
      try {
        values.pv = route.params.accountType;
        const {data: resp} = await api.post('/user/create/social', values);

        api.defaults.headers.authorization = 'Bearer ' + resp.data.token;

        const storeData = {
          id: resp.data.id,
          name: resp.data.name,
          username: resp.data.username,
          pv: resp.data.pv,
          token: resp.data.token,
        };

        await storage.storeData(storeData);

        globalDispatch({
          type: actions.AUTH_LOGIN,
          payload: storeData,
        });
      } catch (error) {
        LoginManager.logOut();
        console.log(error);
        onError(error);
      }
    },

    [route.params.accountType],
  );

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    var email = appleAuthRequestResponse.email;
    var name = appleAuthRequestResponse.fullName.givenName;
    var userId = appleAuthRequestResponse.user;

    var identityToken = appleAuthRequestResponse.user;
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (
      !(credentialState === appleAuth.State.AUTHORIZED) &&
      !(realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL)
    ) {
      throw new Error('Apple invalida');
    }

    console.log({
      username: name + identityToken.substring(0, 5),
      email: email,
      name: name,
      socialId: userId,
      socialType: 'apple',
      token: identityToken,
      password: name + userId + Math.random(),
      avatar: '',
    });

    onRegisterSocial({
      username:
        name != null
          ? name.trim() + identityToken.substring(0, 5)
          : identityToken.substring(0, 10).replace('.', ''),
      email: email,
      name:
        name != null ? name : identityToken.substring(0, 10).replace('.', ''),
      socialId: userId,
      socialType: 'apple',
      token: identityToken,
      password: name + userId + Math.random(),
      avatar: '',
    });
  }

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    touched,
    errors,
    values,
  } = useFormik({
    onSubmit: onRegister,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <KeyboardAvoidingView style={styles.keyboard} behavior={config.behavior}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Spacer />
            <Spacer />
            <Text format="title" style={{textAlign: 'center'}}>
              Faça seu cadastro
            </Text>
            <Spacer size="small" />

            <Input
              value={values.name}
              autoCapitalize="none"
              onBlur={() => handleBlur('name')}
              onChangeText={handleChange('name')}
              error={touched.name && errors.name}
              placeholder="Nome"
            />

            <Spacer size="smaller" />

            <Input
              value={values.username}
              autoCapitalize="none"
              onBlur={() => handleBlur('username')}
              onChangeText={handleChange('username')}
              error={touched.username && errors.username}
              placeholder="Nome de usuário"
            />

            <Spacer size="smaller" />

            <Input
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => handleBlur('email')}
              onChangeText={handleChange('email')}
              error={touched.email && errors.email}
              placeholder="E-mail"
            />

            <Spacer size="smaller" />

            <PasswordInput
              value={values.password}
              autoCapitalize="none"
              eyeStatus={showPass}
              secureTextEntry={!showPass}
              setShowPass={setShowPass}
              textContentType="password"
              onBlur={() => handleBlur('password')}
              onChangeText={handleChange('password')}
              error={touched.password && errors.password}
              placeholder="Senha"
            />

            <Spacer size="smaller" />

            <PasswordInput
              eyeStatus={showPassConfirm}
              secureTextEntry={!showPassConfirm}
              setShowPass={setShowPassConfirm}
              autoCapitalize="none"
              textContentType="password"
              value={values.confirmPassword}
              onBlur={() => handleBlur('confirmPassword')}
              onChangeText={handleChange('confirmPassword')}
              error={touched.confirmPassword && errors.confirmPassword}
              placeholder="Confirme sua senha"
            />
            <Spacer />

            <Button
              text="Salvar"
              disabled={isSubmitting}
              onPress={handleSubmit}
              loading={isSubmitting}
            />

            {/* <Spacer />
            <View style={styles.division}>
              <Text style={styles.divisionText}>ou</Text>
            </View>
            <Spacer /> */}

            <Spacer />
            <View>
              {/* google */}
              <Touchable
                onPress={async () => {
                  try {
                    await GoogleSignin.hasPlayServices();
                    const {user} = await GoogleSignin.signIn();

                    const tokens = await GoogleSignin.getTokens();

                    onRegisterSocial({
                      username: user.givenName + user.id,
                      email: user.email,
                      name: user.name,
                      socialId: user.id,
                      socialType: 'google',
                      token: tokens.accessToken,
                      password: user.givenName + user.id + Math.random(),
                      avatar: user.photo,
                    });
                  } catch (error) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                      // user cancelled the login flow
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                      // operation (e.g. sign in) is in progress already
                    } else if (
                      error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                    ) {
                      // play services not available or outdated
                    } else {
                      // some other error happened
                    }
                  }
                }}>
                <View style={styles.login20Button}>
                  <View style={{width: 30}}>
                    <Google />
                  </View>
                  <Text format="buttonLabel">Criar pelo Google</Text>
                </View>
              </Touchable>

              {/* facebook */}
              <View style={{position: 'relative'}}>
                <LoginButton
                  style={{
                    width: '100%',
                    height: 45,
                    position: 'absolute',
                    zIndex: 999,
                    opacity: 0.03,
                  }}
                  onLoginFinished={(error, result) => {
                    if (error) {
                      onError(result.error);
                    } else if (result.isCancelled) {
                      //usuário cancelou
                    } else {
                      AccessToken.getCurrentAccessToken().then(data => {
                        let accessToken = data.accessToken;

                        const responseInfoCallback = async (error, result) => {
                          if (error) {
                            onError(error);
                          } else {
                            console.log(result);
                            onRegisterSocial({
                              username: result.first_name + result.id,
                              email: result.email,
                              name: result.name,
                              socialId: result.id,
                              socialType: 'facebook',
                              token: accessToken,
                              password:
                                result.first_name + result.id + Math.random(),
                              avatar: result.picture.data.url,
                            });
                          }
                        };

                        const infoRequest = new GraphRequest(
                          '/me',
                          {
                            accessToken: accessToken,
                            parameters: {
                              fields: {
                                string:
                                  'email,name,first_name,middle_name,last_name,picture',
                              },
                            },
                          },
                          responseInfoCallback,
                        );

                        console.log(infoRequest);

                        // Start the graph request.
                        new GraphRequestManager()
                          .addRequest(infoRequest)
                          .start();
                      });
                    }
                  }}
                  onLogoutFinished={() => false}
                />
                <Touchable>
                  <View style={styles.login20Button}>
                    <View style={{width: 28, marginRight: 3}}>
                      <Facebook />
                    </View>
                    <Text format="buttonLabel">Criar pelo Facebook</Text>
                  </View>
                </Touchable>
              </View>
              <Touchable onPress={onAppleButtonPress}>
                <View style={styles.login20Button}>
                  <View style={{width: 28, marginRight: 3}}>
                    <Apple />
                  </View>
                  <Text format="buttonLabel">Criar pelo Apple</Text>
                </View>
              </Touchable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const validationSchema = Yup.object({
  name: Yup.string().required(yup.required),
  username: Yup.string()
    .matches(/^\S*$/, 'Não pode conter espaços em branco')
    .required(yup.required),
  email: Yup.string(yup.string).email(yup.email).required(yup.required),
  password: Yup.string(yup.string).required(yup.required),
  confirmPassword: Yup.string(yup.string)
    .required(yup.required)
    .oneOf([Yup.ref('password'), null], 'As senhas não correspondem'),
});

export default Register;
