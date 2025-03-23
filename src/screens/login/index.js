import * as Yup from 'yup';
import {useFormik} from 'formik';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback, useContext, useState} from 'react';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  View,
  Image,
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

import styles from './styles';
import {actions} from '../../state';
import {api, Context} from '../../services';
import {onError, storage} from '../../helpers';
import {Button} from '../../components/molecules';
import {colors, config, yup} from '../../assets/others';
import {
  Text,
  Input,
  Spacer,
  Touchable,
  PasswordInput,
} from '../../components/atoms';
import {Apple, Facebook, Google} from '../../assets/svg/icons';

const INITIAL_VALUES = {
  username: '',
  password: '',
};

const Login = ({navigation}) => {
  const [, globalDispatch] = useContext(Context);

  const logout = async () => {
    await storage.clean();
    await globalDispatch({type: actions.AUTH_LOGOUT});
    LoginManager.logOut();
    await GoogleSignin.signOut();
  };

  const [showPass, setShowPass] = useState(false);

  const onLogin = useCallback(
    async values => {
      try {
        const {data: resp} = await api.post('/session', values);

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
        console.log(error);
        onError(error);
      }
    },
    [globalDispatch],
  );

  const onLoginSocial = async values => {
    try {
      const {data: resp} = await api.post('/session/social', values);

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
      onError(error);
      logout();
    }
  };

  async function onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    var email = appleAuthRequestResponse.email;
    var name = appleAuthRequestResponse.fullName.givenName;

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

    onLoginSocial({
      username:
        name != null
          ? name.trim() + identityToken.substring(0, 5)
          : identityToken.substring(0, 10).replace('.', ''),
      email: email,
      name:
        name != null ? name : identityToken.substring(0, 10).replace('.', ''),
      socialId: identityToken,
      socialType: 'apple',
      token: identityToken,
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
    onSubmit: onLogin,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <KeyboardAvoidingView style={styles.keyboard} behavior={config.behavior}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.containerLogo}>
                <Image
                  source={require('./../../assets/images/logo/logo-with-text.png')}
                  style={styles.logo}
                />
              </View>
            </View>
            <Spacer />

            <Text format="title" style={{textAlign: 'center'}}>
              Acesse sua conta
            </Text>
            <Spacer />
            <Input
              value={values.username}
              autoCapitalize="none"
              onBlur={() => handleBlur('username')}
              onChangeText={handleChange('username')}
              error={touched.username && errors.username}
              placeholder="Nome de usuário"
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

            <Button
              text="Entrar"
              disabled={isSubmitting}
              onPress={handleSubmit}
              loading={isSubmitting}
            />

            <Spacer size="smaller" />

            <Touchable
              style={styles.btnPassRecovery}
              onPress={() => navigation.navigate('passwordRecovery')}>
              <Text format="bodySmall">Esqueci minha senha</Text>
            </Touchable>

            <Spacer />

            <Spacer />

            <Touchable
              onPress={async () => {
                try {
                  await GoogleSignin.hasPlayServices();
                  const {user} = await GoogleSignin.signIn();
                  const tokens = await GoogleSignin.getTokens();
                  onLoginSocial({
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
                    console.log('cancelled', error);
                  } else if (error.code === statusCodes.IN_PROGRESS) {
                    // operation (e.g. sign in) is in progress already

                    console.log('in progress', error);
                  } else if (
                    error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                  ) {
                    // play services not available or outdated
                    console.log('not available', error);
                  } else {
                    // some other error happened
                    console.log('other error', error);
                  }
                }
              }}>
              <View style={styles.login20Button}>
                <View style={{width: 30}}>
                  <Google />
                </View>
                <Text format="buttonLabel">Entre pelo Google</Text>
              </View>
            </Touchable>

            {/* facebook */}
            <View style={{position: 'relative'}}>
              <LoginButton
                style={{
                  width: '100%',
                  height: 45,
                  position: 'absolute',
                  zIndex: 1,
                  opacity: 0.03,
                }}
                onLoginFinished={(error, result) => {
                  if (error) {
                    onError(result.error);
                  } else if (result.isCancelled) {
                    //usuário cancelou o login
                  } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                      let accessToken = data.accessToken;

                      const responseInfoCallback = async (error, result) => {
                        if (error) {
                          onError(error);
                        } else {
                          console.log(result);
                          onLoginSocial({
                            username: result.first_name + result.id,
                            email: result.email,
                            name: result.name,
                            socialId: result.id,
                            socialType: 'facebook',
                            token: accessToken,
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

                      // Start the graph request.
                      new GraphRequestManager().addRequest(infoRequest).start();
                    });
                  }
                }}
              />
              <View style={styles.login20Button}>
                <View style={{width: 28, marginRight: 3}}>
                  <Facebook />
                </View>
                <Text format="buttonLabel">Entre pelo Facebook</Text>
              </View>
            </View>
            <Touchable onPress={onAppleButtonPress}>
              <View style={styles.login20Button}>
                <View style={{width: 28, marginRight: 3}}>
                  <Apple />
                </View>
                <Text format="buttonLabel">Entre pelo Apple</Text>
              </View>
            </Touchable>

            <Spacer size="small" />

            <View style={styles.division}>
              <Text style={styles.divisionText}>ou</Text>
            </View>
            <Spacer />

            <View style={styles.footer}>
              <Text format="subtitle">Ainda não tem uma conta?</Text>
              <Touchable onPress={() => navigation.navigate('accountType')}>
                <Text format="subtitleBold">Crie sua conta aqui.</Text>
              </Touchable>
              <Spacer />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const validationSchema = Yup.object({
  username: Yup.string(yup.string).required(yup.required),
  password: Yup.string(yup.string).required(yup.required),
});

export default Login;
