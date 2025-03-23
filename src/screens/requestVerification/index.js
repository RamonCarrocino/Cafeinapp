import * as Yup from 'yup';
import {useFormik} from 'formik';
import React, {useState, useEffect} from 'react';
import RenderHtml from 'react-native-render-html';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import {pickSingle, types} from 'react-native-document-picker';
import {
  StatusBar,
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';

import styles from './styles';
import {onError} from '../../helpers';
import {api} from '../../services';
import {NavHeaderBase} from '../../components/organisms';
import {Text, Spacer, Touchable, Input, Loader} from '../../components/atoms';
import {Button} from '../../components/molecules';
import {Check, Upload} from '../../assets/svg/icons';
import {colors} from '../../assets/others';
import {Mask} from '@tboerc/maskfy';

const INITIAL_VALUES = {
  document: '',
  accountableName: '',
  accountablePhone: '',
  socialReason: '',
  notes: '',
  // documentComprobatory: '',
  frontImage: '',
};

const RequestVerification = ({navigation}) => {
  const {width} = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);

  const [terms, setTerms] = useState('');

  const onSubmit = async values => {
    try {
      const formData = new FormData();
      formData.append('document', values.document);
      formData.append('accountableName', values.accountableName);
      formData.append('socialReason', values.socialReason);
      formData.append('notes', values.notes);
      formData.append('accountablePhone', values.accountablePhone);
      // formData.append('documentComprobatory', values.documentComprobatory);
      if (values.frontImage) {
        formData.append('frontImage', values.frontImage);
      }

      await api.post('/user-verifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigation.pop();
    } catch (error) {
      console.log(error);
      onError(error);
    }
  };

  const handleUpload = async () => {
    await launchImageLibrary(
      {mediaType: 'photo', quality: 0.7, maxHeight: 1000, maxWidth: 1000},
      async image => {
        if (image.didCancel) {
          return false;
        }
        setFieldValue('frontImage', {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        });
      },
    );
  };

  const handlePicker = async () => {
    try {
      const doc = await pickSingle({type: [types.pdf, types.images]});

      if (doc) {
        setFieldValue('documentComprobatory', {
          uri: doc.uri,
          type: doc.type,
          name: doc.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  } = useFormik({
    onSubmit,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const {data: resp} = await api.get('/settings');

        setTerms(resp.data?.verificationTerms);

        setIsLoading(false);
      } catch (error) {
        // setIsLoading(false);
        console.log('Error ', error);
      }
    };

    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <NavHeaderBase navigation={navigation} title="Verificar perfil" />

        {isLoading ? (
          <Loader />
        ) : (
          <View style={styles.content}>
            {terms && (
              <>
                <Text format="bodyBold">Termos da verificação</Text>
                <RenderHtml
                  baseStyle={{color: 'black'}}
                  contentWidth={width}
                  source={{html: terms}}
                />
                <Spacer />
              </>
            )}

            <View>
              <Input
                label="CNPJ"
                value={values.document}
                keyboardType="number-pad"
                onBlur={() => handleBlur('document')}
                onChangeText={v =>
                  setFieldValue('document', Mask.cnpj.value(v))
                }
                error={touched.document && errors.document}
                placeholder="00.000.000/0001-00"
              />

              <Spacer size="small" />

              <Input
                value={values.socialReason}
                onBlur={() => handleBlur('socialReason')}
                onChangeText={handleChange('socialReason')}
                error={touched.socialReason && errors.socialReason}
                label="Razão social"
              />

              <Spacer size="small" />

              <Input
                value={values.accountableName}
                onBlur={() => handleBlur('accountableName')}
                onChangeText={handleChange('accountableName')}
                error={touched.accountableName && errors.accountableName}
                label="Nome do responsável"
              />

              <Spacer size="small" />

              <Input
                placeholder="(00) 00000-0000"
                value={values.accountablePhone}
                onChangeText={v =>
                  setFieldValue('accountablePhone', Mask.phone.value(v))
                }
                keyboardType="number-pad"
                onBlur={() => handleBlur('accountablePhone')}
                error={touched.accountablePhone && errors.accountablePhone}
                label="Telefone do responsável"
              />

              <Spacer size="small" />

              <Input
                value={values.notes}
                onBlur={() => handleBlur('notes')}
                onChangeText={handleChange('notes')}
                error={touched.notes && errors.notes}
                label="Observações (opcional)"
              />

              <Spacer size="small" />

              {/* <Touchable
                onPress={handlePicker}
                style={[
                  styles.btnDocument,
                  touched.documentComprobatory &&
                    errors.documentComprobatory && {borderColor: colors.red},
                ]}>
                <Text format="small">Documento comprobatório</Text>

                {values.documentComprobatory ? <Check /> : <Upload />}
              </Touchable>
              {touched.documentComprobatory && errors.documentComprobatory && (
                <Text style={styles.error} format="error">
                  {errors.documentComprobatory}
                </Text>
              )}

              <Spacer size="small" /> */}

              <Touchable
                onPress={handleUpload}
                style={[
                  styles.btnDocument,
                  touched.frontImage &&
                    errors.frontImage && {borderColor: colors.red},
                ]}>
                <Text format="small">Foto da fachada (opcional)</Text>

                {values.frontImage ? <Check /> : <Upload />}
              </Touchable>
              {touched.frontImage && errors.frontImage && (
                <Text style={styles.error} format="error">
                  {errors.frontImage}
                </Text>
              )}

              <Spacer size="small" />

              <Button
                loading={isSubmitting}
                text="Realizar verificação"
                onPress={() => handleSubmit()}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestVerification;

const validationSchema = Yup.object({
  document: Yup.string().required('Campo obrigatório'),
  accountableName: Yup.string().required('Campo obrigatório'),
  socialReason: Yup.string().required('Campo obrigatório'),
  accountablePhone: Yup.string().required('Campo obrigatório'),
  // documentComprobatory: Yup.object().required('Campo obrigatório'),
  // frontImage: Yup.object().required('Campo obrigatório'),
});
