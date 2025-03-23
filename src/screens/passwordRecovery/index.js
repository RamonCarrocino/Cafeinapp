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

import styles from './styles';
import {onError} from '../../helpers';
import {api, Context} from '../../services';
import {Email} from '../../assets/svg/icons';
import globalStyles from './../../globalStyles';
import {colors, config, yup} from '../../assets/others';
import {Text, Input, Spacer, Touchable} from '../../components/atoms';
import {Button, HeaderBase, ModalBase} from '../../components/molecules';

const INITIAL_VALUES = {
  email: '',
};

const PasswordRecovery = ({navigation}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = useCallback(async (values, actions) => {
    try {
      await api.post('/users/password-recovery', values, {headers: {pv: 0}});

      setIsOpen(true);
      actions.resetForm();
    } catch (error) {
      console.log(error);
      onError(error, 'E-mail não encontrado');
    }
  }, []);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    touched,
    errors,
    values,
  } = useFormik({
    onSubmit,
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
          <HeaderBase navigation={navigation} renderHamburger={false} />

          <View style={styles.content}>
            <Text format="h1">Recuperar senha</Text>

            <Spacer size="small" />

            <Input
              value={values.email}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Digite o e-mail"
              // label="E-mail"
              onBlur={() => handleBlur('email')}
              onChangeText={handleChange('email')}
              error={touched.email && errors.email}
            />

            <Spacer />

            <Button
              text="Recuperar senha"
              disabled={isSubmitting}
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalBase isVisible={isOpen} setIsVisible={setIsOpen} position="bottom">
        <Touchable
          style={styles.btnCloseModal}
          onPress={() => setIsOpen(false)}>
          <Text format="h2">X</Text>
        </Touchable>

        <Email width={40} height={40} fill={colors.primary} />

        <Spacer size="small" />

        <Text style={[globalStyles.textJustify]}>
          Enviamos um e-mail contendo os próximos passos. Por favor siga as
          instruções fornecidas no corpo da mensagem enviada.
        </Text>

        <Spacer size="small" />

        <Text style={[globalStyles.textJustify]}>
          Lembre de verificar a caixa de SPAM!
        </Text>

        <Spacer />
      </ModalBase>
    </SafeAreaView>
  );
};

const validationSchema = Yup.object({
  email: Yup.string(yup.string).email(yup.email).required(yup.required),
});

export default PasswordRecovery;
