import dayjs from 'dayjs';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Mask} from '@tboerc/maskfy';
import {View, Image, ScrollView} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import React, {useCallback, useEffect, useState} from 'react';

import styles from './styles';
import {api, useAuth} from '../../../services';
import {yup, regex, colors} from '../../../assets/others';
import {onError, onWarning} from '../../../helpers';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  Text,
  Input,
  Spacer,
  Touchable,
  LabelSearchInput,
  SpacerHorizontal,
} from '../../../components/atoms';
import {
  Button,
  InputFormatCoffee,
  InputUpload,
  Rating,
  ModalBase,
} from '../../../components/molecules';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const COFFEE_BEAN_IMAGE = require('./../../../assets/images/coffeeBean.png');
const COFFEE_BEAN_SELECTED_IMAGE = require('./../../../assets/images/coffeeBeanSelected.png');

const FormConsumer = ({navigation, route}) => {
  const [user] = useAuth();

  const INITIAL_VALUES = {
    productId: '',
    name: '',
    brand: '',
    varietyId: null,
    placeId: null,
    merchantId: user.data.id,
    methodId: '',
    format: '',
    rating: '',
    specie: '',
    price: '',
    weight: '',
    punctuation: '',
    buyDate: '',
    preparationDate: '',
    roastDate: '',
    farm: '',
    region: '',
    altitude: '',
    dryingProcess: '',
    harvest: '',
    roast: '',
    milling: 0,
    coffeeAmount: '',
    waterAmount: '',
    waterTemperature: '',
    extrationTime: '',
    comments: '',
    attachment: '',
    fileLabel: '',
    fileProduct: '',
    sensory: [],
  };

  const [placeIsMerchant, setPlaceIsMerchant] = useState(false);

  const [options, setOptions] = useState({
    methods: [],
    places: [],
    sensory: [],
    varieties: [],
    merchants: [],
  });

  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const isEdit = !!route.params?.id;

  useEffect(() => {
    (async () => {
      const {data: resp} = await api.get('/grade-options');
      setOptions(resp.data);

      const valuesSensory = resp.data.sensory.map(item => {
        return {sensoryId: item.id, value: 0};
      });

      if (isEdit) {
        const grade = route.params;
        setValues({
          //fixos
          productId: grade.product.id,
          name: grade.product.name,
          brand: grade.product.brand,
          varietyId: grade.product.variety?.id || null,
          farm: grade.product.farm,
          region: grade.product.region,
          altitude: String(grade.product.altitude),
          dryingProcess: grade.product.dryingProcess,
          specie: grade.product.specie,

          //variaveis
          id: grade.id,
          placeId: grade.placeId || null,
          merchantId: user.data.id,
          methodId: grade.methodId,
          format: grade.format,
          rating: grade.rating,
          price: grade.price,
          weight: String(grade.weight),
          punctuation: String(grade.punctuation),
          buyDate: grade.buyDate
            ? dayjs(grade.buyDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            : '',
          preparationDate: grade.preparationDate
            ? dayjs(grade.preparationDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            : '',
          roastDate: grade.roastDate
            ? dayjs(grade.roastDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            : '',
          harvest: grade.harvest,
          roast: grade.roast,
          milling: grade.milling,
          coffeeAmount: String(grade.coffeeAmount),
          waterAmount: String(grade.waterAmount),
          waterTemperature: String(grade.waterTemperature),
          extrationTime: String(grade.extrationTime),
          comments: grade.comments,
          attachment: grade.attachment,
          fileLabel: '',
          fileProduct: '',
          sensory: grade.sensorys,
        });
      } else {
        setValues({
          ...INITIAL_VALUES,
          sensory: valuesSensory,
        });
      }
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
    async ({attachment, fileLabel, fileProduct, ...values}) => {
      try {
        delete values.id;

        values.placeIsMerchant = placeIsMerchant;
        values.weight = Number(values.weight);
        values.price = Mask.money.raw(values.price);
        values.coffeeAmount = Number(values.coffeeAmount);
        values.altitude = Number(values.altitude);
        values.waterAmount = Number(values.waterAmount);
        values.waterTemperature = Number(values.waterTemperature);
        values.extrationTime = Number(values.extrationTime);
        values.punctuation = Number(values.punctuation);
        values.buyDate =
          values.buyDate &&
          dayjs(values.buyDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        values.roastDate =
          values.roastDate &&
          dayjs(values.roastDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        values.preparationDate =
          values.preparationDate &&
          dayjs(values.preparationDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

        const formData = new FormData();

        formData.append('attachment', attachment);
        formData.append('fileLabel', fileLabel);
        formData.append('fileProduct', fileProduct);

        formData.append('fields', JSON.stringify(values));

        await api.post('/grade', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });

        navigation.navigate('home');

        resetForm();
      } catch (error) {
        console.log(error);
        onError(error);
      }
    },
    [placeIsMerchant],
  );

  const onUpdate = useCallback(async ({attachment, ...values}) => {
    try {
      values.weight = Number(values.weight);
      values.price = Mask.money.raw(values.price);

      values.coffeeAmount = Number(values.coffeeAmount);
      values.altitude = Number(values.altitude);
      values.waterAmount = Number(values.waterAmount);
      values.waterTemperature = Number(values.waterTemperature);
      values.extrationTime = Number(values.extrationTime);
      values.punctuation = Number(values.punctuation);
      values.buyDate =
        values.buyDate &&
        dayjs(values.buyDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      values.roastDate =
        values.roastDate &&
        dayjs(values.roastDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      values.preparationDate =
        values.preparationDate &&
        dayjs(values.preparationDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const formData = new FormData();

      formData.append('attachment', attachment);
      formData.append('fields', JSON.stringify(values));

      const {data: resp} = await api.put('/grade', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      navigation.navigate('grade', {gradeId: resp.data.id});

      resetForm();
    } catch (error) {
      console.log(error);
      onError(error);
    }
  }, []);

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
      productId: product.id,
      varietyId: product.variety?.id,
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

  const canEdit = values?.productId ? false : true;

  return (
    <View style={styles.content}>
      <Spacer size="smaller" />

      <Spacer size="smaller" />

      <LabelSearchInput
        placeholder="Nome do café"
        value={values.name}
        onChangeText={value => setFieldValue('name', value)}
        onPress={() => !isEdit && findLabel()}
        editable={!isEdit}
        error={touched.name && errors.name}
      />

      <Spacer size="small" />

      <Input
        editable={canEdit}
        label="Marca"
        value={values.brand}
        onBlur={() => handleBlur('brand')}
        onChangeText={handleChange('brand')}
        error={touched.brand && errors.brand}
      />

      <Spacer size="small" />

      <Text format="labelInput">Espécie</Text>
      <View style={styles.boxInput}>
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

      <Spacer size="small" />

      {/* <View style={styles.boxInput}>
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
      />

      <Spacer size="small" /> */}

      <Text format="labelInput" style={styles.label}>
        Preço
      </Text>
      <View style={styles.boxInput}>
        <Input
          row
          value={values.price}
          keyboardType="numeric"
          onBlur={() => handleBlur('price')}
          onChangeText={value => {
            setFieldValue('price', Mask.money.value(value));
          }}
          error={touched.price && errors.price}
          placeholder="R$ 0,00"
        />
        <Spacer size="nanoWidth" />

        <Text format="labelInput">/</Text>
        <Spacer size="nanoWidth" />

        <Input
          row
          value={values.weight}
          keyboardType="numeric"
          autoCapitalize="none"
          onBlur={() => handleBlur('weight')}
          onChangeText={handleChange('weight')}
          error={touched.weight && errors.weight}
          placeholder="00"
          sufix="g"
        />
      </View>

      <Spacer size="small" />

      <Input
        label="Pontuação"
        value={values.punctuation}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('punctuation')}
        onChangeText={handleChange('punctuation')}
        error={touched.punctuation && errors.punctuation}
        placeholder=""
      />
      {/* <Spacer size="small" /> */}

      {/* <View style={styles.boxInput}>
        <Text format="labelInput">Local: </Text>
      </View>

      <SelectInput
        key="selectPlaceId"
        placeholder="Selecione um local"
        value={values.placeId}
        options={[...options.places, ...options.merchants]}
        error={touched.placeId && errors.placeId}
        onChange={(value, full) => {
          setFieldValue('placeId', value);
          setPlaceIsMerchant(!!full.email);
        }}
      /> */}

      <Spacer size="small" />

      <Input
        label="Data da compra"
        value={values.buyDate}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('buyDate')}
        onChangeText={value =>
          setFieldValue('buyDate', Mask.custom.value(value, '99/99/9999'))
        }
        error={touched.buyDate && errors.buyDate}
        placeholder="DD/MM/AAAA"
      />

      <Spacer size="small" />

      <Input
        label="Data do preparo"
        value={values.preparationDate}
        keyboardType="numeric"
        autoCapitalize="none"
        onBlur={() => handleBlur('preparationDate')}
        onChangeText={value =>
          setFieldValue(
            'preparationDate',
            Mask.custom.value(value, '99/99/9999'),
          )
        }
        error={touched.preparationDate && errors.preparationDate}
        placeholder="DD/MM/AAAA"
      />

      <Spacer size="small" />

      <Input
        label="Data da torra"
        value={values.roastDate}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('roastDate')}
        onChangeText={value =>
          setFieldValue('roastDate', Mask.custom.value(value, '99/99/9999'))
        }
        error={touched.roastDate && errors.roastDate}
        placeholder="DD/MM/AAAA"
      />

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

      <Input
        editable={canEdit}
        label="Altitude"
        value={values.altitude}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('altitude')}
        onChangeText={handleChange('altitude')}
        error={touched.altitude && errors.altitude}
        placeholder=""
        sufix="m"
      />

      <Spacer />
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
        label="Safra"
        value={values.harvest}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('harvest')}
        onChangeText={value =>
          setFieldValue('harvest', Mask.custom.value(value, '9999/9999'))
        }
        error={touched.harvest && errors.harvest}
        placeholder="AAAA/AAAA"
      />

      <Spacer size="small" />

      <Text format="labelInput">Torra</Text>
      <View style={styles.containerLevel}>
        <View style={styles.selectLevelCoffee}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Touchable
              key={index.toString()}
              onPress={() => setFieldValue('roast', index)}>
              <Image
                source={
                  values.roast >= index
                    ? COFFEE_BEAN_SELECTED_IMAGE
                    : COFFEE_BEAN_IMAGE
                }
                style={styles.imageLevel}
              />
            </Touchable>
          ))}
        </View>

        <View style={styles.levelCoffee}>
          <Text format="small">clara</Text>
          <Text format="small">média</Text>
          <Text format="small">escura</Text>
        </View>
      </View>
      {touched.roast && errors.roast && (
        <Text style={styles.error} format="error">
          {errors.roast}
        </Text>
      )}

      <Spacer size="small" />

      <Text format="labelInput">Moagem</Text>

      <View style={{flex: 1}}>
        <Slider
          value={values.milling}
          minimumValue={0}
          maximumValue={4}
          trackMarks={[0, 1, 2, 3, 4]}
          onSlidingComplete={value =>
            setFieldValue('milling', Math.round(value))
          }
          thumbTintColor={colors.orange}
          minimumTrackTintColor={colors.secondary}
        />
        <View style={styles.labelsMillings}>
          <Text format="small">fino</Text>
          <Text format="small">médio</Text>
          <Text format="small">grosso</Text>
        </View>
      </View>
      {touched.milling && errors.milling && (
        <Text style={styles.error} format="error">
          {errors.milling}
        </Text>
      )}

      <Spacer size="small" />

      <Text format="labelInput" style={styles.label}>
        Método
      </Text>
      <View style={styles.boxInput}>
        <View style={styles.containerMethodCoffee}>
          <View style={styles.methodCoffee}>
            {options.methods.map((item, index) => (
              <Touchable
                key={index.toString()}
                style={[{alignItems: 'center', marginLeft: 5}]}
                onPress={() => setFieldValue('methodId', item.id)}>
                {item.icon && (
                  <Image
                    source={{uri: item.icon}}
                    style={[
                      styles.imageMethod,
                      {
                        tintColor:
                          values.methodId === item.id
                            ? colors.orange
                            : colors.grey600,
                      },
                    ]}
                  />
                )}

                <Text
                  format="bodyNano"
                  color={
                    values.methodId === item.id
                      ? colors.secondary
                      : colors.grey600
                  }>
                  {item.name}
                </Text>
              </Touchable>
            ))}
          </View>
        </View>
      </View>
      {touched.methodId && errors.methodId && (
        <Text style={styles.error} format="error">
          {errors.methodId}
        </Text>
      )}

      <Spacer size="small" />

      <InputFormatCoffee
        error={values.format}
        touched={touched.format}
        value={values.format}
        setFieldValue={setFieldValue}
      />

      <Spacer size="small" />

      <Input
        label="Qtd. de café"
        value={values.coffeeAmount}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('coffeeAmount')}
        onChangeText={handleChange('coffeeAmount')}
        error={touched.coffeeAmount && errors.coffeeAmount}
        sufix="g"
      />

      <Spacer size="small" />

      <Input
        label="Qtd. de água"
        value={values.waterAmount}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('waterAmount')}
        onChangeText={handleChange('waterAmount')}
        error={touched.waterAmount && errors.waterAmount}
        sufix="ml"
      />

      <Spacer size="small" />

      <Input
        label="Temperatura da água"
        value={values.waterTemperature}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('waterTemperature')}
        onChangeText={handleChange('waterTemperature')}
        error={touched.waterTemperature && errors.waterTemperature}
        sufix="C"
      />

      <Spacer size="small" />

      <Input
        label="Tempo de extração"
        value={values.extrationTime}
        autoCapitalize="none"
        keyboardType="numeric"
        onBlur={() => handleBlur('extrationTime')}
        onChangeText={handleChange('extrationTime')}
        error={touched.extrationTime && errors.extrationTime}
        sufix="min"
      />

      <Spacer size="small" />

      <Text format="labelInput" style={styles.label}>
        Sensorial
      </Text>

      <View style={{flex: 1}}>
        {options.sensory.map((item, index) => (
          <View key={index} style={styles.boxSlider}>
            <Text format="labelInput" style={{marginTop: 2}}>
              {item.name}:
            </Text>

            <SpacerHorizontal size="nano" />

            <View style={{flex: 1}}>
              <Slider
                value={values.sensory.find(s => s.sensoryId === item.id)?.value}
                minimumValue={0}
                maximumValue={5}
                renderThumbComponent={() => (
                  <View
                    style={{
                      backgroundColor: colors.orange,
                      width: 17,
                      height: 17,
                      borderWidth: 2,
                      borderColor: colors.secondary,
                      borderRadius: 10,
                    }}
                  />
                )}
                renderTrackMarkComponent={() => (
                  <View
                    style={{
                      backgroundColor: colors.secondary,
                      width: 2,
                      height: 10,
                    }}
                  />
                )}
                trackMarks={[0, 1, 2, 3, 4, 5]}
                trackStyle={{height: 2}}
                onSlidingComplete={e =>
                  setFieldValue(
                    'sensory',
                    values.sensory.map(s =>
                      s.sensoryId === item.id
                        ? {...s, value: Math.round(e)}
                        : s,
                    ),
                  )
                }
              />
              <View style={styles.labelsMillings}>
                <Text format="small">0</Text>

                <Text format="small">5</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Spacer size="small" />

      <Input
        value={values.comments}
        autoCapitalize="none"
        onBlur={() => handleBlur('comments')}
        onChangeText={handleChange('comments')}
        error={touched.comments && errors.comments}
        label="Notas e percepções"
      />

      <Spacer size="small" />

      <Text format="labelInput" style={styles.label}>
        Avaliação
      </Text>
      <View style={styles.rating}>
        <Rating
          onChange={value => setFieldValue('rating', value)}
          value={values.rating}
        />
      </View>
      {touched.rating && errors.rating && (
        <Text style={styles.error} format="error">
          {errors.rating}
        </Text>
      )}
      <Spacer />

      <View style={styles.buttonsFooter}>
        <InputUpload
          label="Imagem do café"
          handleUpload={() => handleUpload('attachment')}
          uri={values?.attachment?.uri}
        />
        {touched.attachment && errors.attachment && (
          <Text style={styles.error} format="error">
            {errors.attachment}
          </Text>
        )}
        <Spacer />

        <Spacer />

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
            onPress={() => {
              resetForm();
            }}
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
                onWarning({message: 'Preencha todos os campos obrigatórios'});
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

                <Text align="center" format="bodyBold">
                  {prod.name}
                </Text>
                <Text align="center">{prod.brand}</Text>

                <Spacer />
              </Touchable>
            ))}
          </View>
        </ScrollView>
      </ModalBase>
    </View>
  );
};

const validationSchema = Yup.object({
  //fixos
  name: Yup.string().required(yup.required),
  brand: Yup.string().required(yup.required),
  // varietyId: Yup.string().required(yup.required),
  farm: Yup.string().required(yup.required),
  region: Yup.string().required(yup.required),
  altitude: Yup.number().required(yup.required),
  dryingProcess: Yup.string().required(yup.required),
  specie: Yup.string().required(yup.required),
  // placeId: Yup.string().required(yup.required),

  price: Yup.string(),
  weight: Yup.number(),
  punctuation: Yup.number(),
  buyDate: Yup.string().matches(regex.date, yup.date),
  roastDate: Yup.string().matches(regex.date, yup.date),
  preparationDate: Yup.string().matches(regex.date, yup.date),
  harvest: Yup.string(),
  coffeeAmount: Yup.number(),
  waterAmount: Yup.number(),
  waterTemperature: Yup.number(),
  extrationTime: Yup.number(),
  comments: Yup.string(),

  merchantId: Yup.string().required(yup.required),
  fileLabel: Yup.object().when('productId', {
    is: productId => !productId,
    then: Yup.object(),
  }),
  fileProduct: Yup.object().when('productId', {
    is: productId => !productId,
    then: Yup.object(),
  }),
});

export default FormConsumer;
