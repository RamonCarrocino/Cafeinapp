import * as Yup from 'yup';
import {useFormik} from 'formik';
import {View, Image, ScrollView} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  Input,
  Spacer,
  Touchable,
  LabelSearchInput,
  Loader,
} from '../../../components/atoms';

import styles from './styles';
import {yup} from '../../../assets/others';
import {api, useAuth} from '../../../services';
import {onError, onSuccess, onWarning} from '../../../helpers';
import {
  Button,
  InputFormatCoffee,
  InputUpload,
} from '../../../components/molecules';
import ModalBase from '../../../components/molecules/modalBase';

const COFFEE_BEAN_IMAGE = require('./../../../assets/images/coffeeBean.png');
const COFFEE_BEAN_SELECTED_IMAGE = require('./../../../assets/images/coffeeBeanSelected.png');

const FormEstablishment = ({navigation, route}) => {
  const user = useAuth()[0].data;

  const INITIAL_VALUES = {
    productId: '',
    merchantId: user.id,
    varietyId: null,
    barcode: '',
    name: '',
    brand: '',
    specie: '',
    // roastDate: '',
    sensoryNotes: '',
    farm: '',
    region: '',
    altitude: '',
    dryingProcess: '',
    roast: '',
    format: '',
    notEdit: true,
    fileLabel: '',
    fileProduct: '',
  };

  const [options, setOptions] = useState({
    places: [],
    varieties: [],
  });

  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const isEdit = !!route.params?.id;

  useEffect(() => {
    (async () => {
      const {data: resp} = await api.get('/grade-options');
      setOptions(resp.data);

      if (isEdit) {
        let {data: userProduct} = await api.get(
          `/user-product/${route.params?.id}`,
        );

        userProduct = userProduct.data;

        setValues({
          //variáveis
          id: userProduct.id,
          productId: userProduct.productId,
          merchantId: user.id,
          format: userProduct.format,
          //fixos
          sensoryNotes: userProduct.product.sensoryNotes,
          roast: userProduct.product.roast,
          varietyId: userProduct.product.varietyId,
          barcode: userProduct.product.barcode,
          name: userProduct.product.name,
          brand: userProduct.product.brand,
          specie: userProduct.product.specie,
          farm: userProduct.product.farm,
          region: userProduct.product.region,
          altitude: String(userProduct.product.altitude),
          dryingProcess: userProduct.product.dryingProcess,
          notEdit: false,
          fileLabel: '',
          fileProduct: '',
        });
      } else {
        setValues({
          ...INITIAL_VALUES,
        });
      }

      setIsLoading(false);
    })();
  }, [route.params]);

  const handleUpload = async field => {
    await launchImageLibrary(
      {mediaType: 'photo', quality: 0.7, maxHeight: 500, maxWidth: 500},
      async image => {
        if (image.didCancel) {
          return false;
        }

        setFieldValue(field, {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        });
      },
    );
  };

  const onRegister = useCallback(
    async ({fileLabel, fileProduct, ...values}) => {
      try {
        delete values.id;
        values.merchantId = user.id;
        values.altitude = Number(values.altitude);
        // values.roastDate = dayjs(values.roastDate, 'DD/MM/YYYY').format(
        //   'YYYY-MM-DD',
        // );
        delete values.notEdit;

        const formData = new FormData();

        formData.append('fileLabel', fileLabel);
        formData.append('fileProduct', fileProduct);
        formData.append('fields', JSON.stringify(values));

        await api.post('/user-product', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        if (!values.productId) {
          onSuccess(
            null,
            'Obrigado pelo novo cadastro. Ele será avaliado para poder ser exibido',
          );
        }

        navigation.navigate('home');

        resetForm();
      } catch (error) {
        console.log(error);
        onError(error);
      }
    },
    [],
  );

  const onUpdate = useCallback(async ({file, ...values}) => {
    try {
      values.merchantId = user.id;
      // values.roastDate = dayjs(values.roastDate, 'DD/MM/YYYY').format(
      //   'YYYY-MM-DD',
      // );

      delete values.notEdit;

      const {data: resp} = await api.put('/user-product', values);

      navigation.navigate('product', {productId: values.productId});
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
    onSubmit: isEdit ? onUpdate : onRegister,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  const findLabel = async () => {
    try {
      if (values.name) {
        let {data: resp} = await api.get(
          `/products?query=${values.name}&status=1`,
        );

        if (resp.data.length > 0) {
          setProducts(resp.data);
          setIsOpen(true);
        } else {
          onWarning({message: 'Não foi encontrado nenhum resultado'});
        }
      }
    } catch (error) {
      onError(error);
    }
  };

  const onSelectProduct = product => {
    setValues({
      ...values,
      sensoryNotes: product.sensoryNotes,
      roast: product.roast,
      productId: product.id,
      varietyId: product.variety?.id || null,
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      specie: product.specie,
      farm: product.farm,
      region: product.region,
      altitude: String(product.altitude),
      dryingProcess: product.dryingProcess,
    });

    setIsOpen(false);
  };

  const canEdit = values.productId ? false : true;

  return (
    <View style={styles.content}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Spacer />

          {/* <InputProduct
  value={values.barcode}
  autoCapitalize="none"
  onBlur={() => handleBlur('barcode')}
  onChangeText={handleChange('barcode')}
  error={touched.barcode && errors.barcode}
  placeholder="Código de barras"
  styleInput={{width: '100%'}}
/> */}
          {/* <Spacer size="small" /> */}

          <LabelSearchInput
            placeholder="Nome do café"
            value={values.name}
            onChangeText={value => setFieldValue('name', value)}
            onPress={() => !isEdit && findLabel()}
            editable={!isEdit}
          />

          {touched.name && errors.name && (
            <Text style={styles.error} format="error">
              {errors.name}
            </Text>
          )}

          <Spacer size="small" />

          <Input
            editable={canEdit}
            label="Marca"
            value={values.brand}
            onBlur={() => handleBlur('brand')}
            onChangeText={handleChange('brand')}
            error={touched.brand && errors.brand}
            placeholder="                        "
          />

          <Spacer size="small" />

          <Text format="labelInput">Espécie: </Text>
          <View style={[styles.boxInput]}>
            <Touchable
              onPress={() => canEdit && setFieldValue('specie', 'Canéphora')}
              style={[
                styles.selectButton,
                values.specie === 'Canéphora' && styles.shadowProp,
              ]}>
              <Text
                format="labelInput"
                style={values.specie === 'Canéphora' && {color: 'white'}}>
                Canéphora
              </Text>
            </Touchable>
            <Touchable
              onPress={() => canEdit && setFieldValue('specie', 'Arábica')}
              style={[
                styles.selectButton,
                values.specie === 'Arábica' && styles.shadowProp,
              ]}>
              <Text
                format="labelInput"
                style={values.specie === 'Arábica' && {color: 'white'}}>
                Arábica
              </Text>
            </Touchable>
            <Touchable
              onPress={() => canEdit && setFieldValue('specie', 'Blend')}
              style={[
                styles.selectButton,
                values.specie === 'Blend' && styles.shadowProp,
              ]}>
              <Text
                format="labelInput"
                style={values.specie === 'Blend' && {color: 'white'}}>
                Blend
              </Text>
            </Touchable>
          </View>
          {touched.specie && errors.specie && (
            <Text style={styles.error} format="error">
              {errors.specie}
            </Text>
          )}

          {/* <Spacer size="small" />

          <View style={styles.boxInput}>
            <Text format="labelInput">Variedade: </Text>
          </View>

          <SelectInput
            editable={canEdit}
            key="selectVarietyId"
            placeholder="Selecione uma variedade"
            value={values.varietyId}
            options={options.varieties}
            error={touched.varietyId && errors.varietyId}
            onChange={value => setFieldValue('varietyId', value)}
          /> */}

          <Spacer size="small" />

          {/* <Input
  label="Data da torra"
  type="date"
  value={values.roastDate}
  autoCapitalize="none"
  keyboardType="numeric"
  onBlur={() => handleBlur('roastDate')}
  onChangeText={value =>
    setFieldValue('roastDate', Mask.custom.value(value, '99/99/9999'))
  }
  error={touched.roastDate && errors.roastDate}
  placeholder="  /  /  "
/> */}

          <Spacer size="small" />

          <Input
            editable={canEdit}
            label="Fazenda"
            value={values.farm}
            autoCapitalize="none"
            onBlur={() => handleBlur('farm')}
            onChangeText={handleChange('farm')}
            error={touched.farm && errors.farm}
            placeholder="                        "
          />

          <Spacer size="small" />

          <Input
            editable={canEdit}
            label="Região"
            value={values.region}
            autoCapitalize="none"
            onBlur={() => handleBlur('region')}
            onChangeText={handleChange('region')}
            error={touched.region && errors.region}
            placeholder="                        "
          />

          <Spacer size="small" />

          <View style={styles.boxInput}>
            <Input
              editable={canEdit}
              label="Altitude"
              value={values.altitude}
              autoCapitalize="none"
              keyboardType="numeric"
              onBlur={() => handleBlur('altitude')}
              onChangeText={handleChange('altitude')}
              error={touched.altitude && errors.altitude}
              placeholder="                 "
            />
            <Spacer size="nanoWidth" />

            <Text format="labelInput">m</Text>
          </View>

          <Spacer size="small" />

          <Input
            editable={canEdit}
            label="Processo de secagem"
            value={values.dryingProcess}
            autoCapitalize="none"
            onBlur={() => handleBlur('dryingProcess')}
            onChangeText={handleChange('dryingProcess')}
            error={touched.dryingProcess && errors.dryingProcess}
            placeholder="                 "
          />

          <Spacer size="small" />

          <Input
            style={{maxWidth: '50%'}}
            label="Notas sensoriais"
            value={values.sensoryNotes}
            autoCapitalize="none"
            onBlur={() => handleBlur('sensoryNotes')}
            onChangeText={handleChange('sensoryNotes')}
            error={touched.sensoryNotes && errors.sensoryNotes}
            placeholder="                 "
          />

          <Spacer size="small" />

          {/* torra */}
          <View style={styles.boxInput}>
            <Text format="labelInput">Torra: </Text>
            <View style={styles.containerLevel}>
              <View style={styles.selectLevelCoffee}>
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <Touchable
                    key={item.toString()}
                    onPress={() => setFieldValue('roast', item)}>
                    <Image
                      source={
                        values.roast === item
                          ? COFFEE_BEAN_SELECTED_IMAGE
                          : COFFEE_BEAN_IMAGE
                      }
                      style={styles.imageLevel}
                    />
                  </Touchable>
                ))}
              </View>

              <View style={styles.levelCoffee}>
                <Text>clara</Text>
                <Text>média</Text>
                <Text>escura</Text>
              </View>
            </View>
          </View>
          {touched.roast && errors.roast && (
            <Text style={styles.error} format="error">
              {errors.roast}
            </Text>
          )}

          <Spacer size="small" />

          <InputFormatCoffee
            error={values.format}
            touched={touched.format}
            value={values.format}
            setFieldValue={setFieldValue}
          />

          <Spacer />

          <View style={styles.buttonsFooter}>
            {!values.productId && (
              <>
                <InputUpload
                  label="Imagem do café"
                  handleUpload={() => handleUpload('fileProduct')}
                  uri={values?.fileProduct?.uri || values?.fileProduct}
                />
                {touched.fileProduct && errors.fileProduct && (
                  <Text style={styles.error} format="error">
                    {errors.fileProduct}
                  </Text>
                )}
                <Spacer />

                {/* <InputUpload
        label="Foto do rótulo"
        handleUpload={() => handleUpload('fileLabel')}
        uri={values?.fileLabel?.uri || values?.fileLabel}
      />
      {touched.fileLabel && errors.fileLabel && (
        <Text style={styles.error} format="error">
          {errors.fileLabel}
        </Text>
      )} */}

                <Spacer />
              </>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Button
                style={styles.buttonReset}
                text="Limpar campos"
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={() => resetForm()}
              />

              <Button
                style={styles.buttonSave}
                text="Salvar"
                disabled={isSubmitting}
                onPress={() => {
                  handleSubmit();

                  function isEmptyObject(obj) {
                    return !!Object.values(obj).length;
                  }

                  isEmptyObject(errors) &&
                    onWarning({
                      message: 'Preencha todos os campos obrigatórios',
                    });
                }}
                loading={isSubmitting}
              />
            </View>
          </View>
          {touched.file && errors.file && (
            <Text style={styles.error} format="error">
              {errors.file}
            </Text>
          )}
          <Spacer />

          <Spacer />

          <ModalBase
            flex={1}
            isVisible={isOpen}
            setIsVisible={setIsOpen}
            position="bottom">
            <Spacer />

            <View style={styles.modalHeader}>
              <Text format="bodyBold">Selecionar produto</Text>
              <Touchable onPress={() => setIsOpen(false)}>
                <Text format="bodyBold">X</Text>
              </Touchable>
            </View>

            <Spacer />

            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View style={styles.modalBody}>
                {products.map(prod => (
                  <Touchable
                    onPress={() => onSelectProduct(prod)}
                    style={styles.viewProduct}
                    key={prod.id}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: prod?.attachments?.[0]?.uri,
                      }}
                    />

                    <Text format="bodyBold">{prod.name}</Text>
                    <Text>{prod.brand}</Text>

                    <Spacer />
                  </Touchable>
                ))}
              </View>
            </ScrollView>
          </ModalBase>
        </>
      )}
    </View>
  );
};

const validationSchema = Yup.object({
  // merchantId: Yup.string().required('Campo obrigatório'),
  // barcode: Yup.string().required('Campo obrigatório'),
  // varietyId: Yup.string().required('Campo obrigatório'),
  name: Yup.string().required(yup.required),
  brand: Yup.string().required(yup.required),
  specie: Yup.string().required(yup.required),
  // roastDate: Yup.string().required(yup.required).matches(regex.date, yup.date),
  farm: Yup.string().required(yup.required),
  region: Yup.string().required(yup.required),
  altitude: Yup.number().required(yup.required),
  dryingProcess: Yup.string().required(yup.required),
  roast: Yup.number().required(yup.required),
  format: Yup.string().required(yup.required),
  notEdit: Yup.boolean(),
  fileLabel: Yup.object().when('productId', {
    is: productId => !productId,
    then: Yup.object(),
  }),
  fileProduct: Yup.object().when('productId', {
    is: productId => !productId,
    then: Yup.object().required(yup.required),
  }),
});

export default FormEstablishment;
