import * as Yup from 'yup';
import {useFormik} from 'formik';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, View, ScrollView, Image, Platform} from 'react-native';

import styles from './styles';
import {onError} from '../../helpers';
import {colors} from '../../assets/others';
import {api, useAuth} from '../../services';
import {MapMarker, Eye} from '../../assets/svg/icons';
import {NavHeaderBase} from '../../components/organisms';
import {Button, ModalBase, Rating} from '../../components/molecules';
import {Text, Spacer, Touchable, InputProfile} from '../../components/atoms';

const AVATAR = require('./../../assets/images/avatar.png');
const PENCIL = require('./../../assets/images/icons/pencil.png');
const COFFEE_BEAN_IMAGE = require('./../../assets/images/coffeeBean.png');
const COFFEE_BEAN_SELECTED_IMAGE = require('./../../assets/images/coffeeBeanSelected.png');

// selectedFilter: rating or merchant

const Product = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [product, setProduct] = useState();
  const [ratings, setRatings] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('rating');

  const user = useAuth()[0].data;

  const IS_THE_OWNER = product?.merchants?.find(m => m.userId === user.id);

  const handlePrivacy = async () => {
    try {
      const newStatus = IS_THE_OWNER.status === 1 ? 0 : 1;

      await api.put(`/user-product/change-status/${IS_THE_OWNER.id}`, {
        status: newStatus,
      });

      const newMerchants = product.merchants.map(m => {
        if (IS_THE_OWNER.id === m.id) {
          m.status = newStatus;
        }

        return m;
      });

      setProduct(prevState => ({...prevState, merchants: newMerchants}));
    } catch (error) {
      console.log('Error ', error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const {data: resp} = await api.get(
          `/product/${route.params.productId}`,
        );

        setProduct({
          ...resp.data,
          price: !!resp.data?.price && Number(resp.data.price).toFixed(2),
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error ', error);
      }
    };

    getData();
  }, [ratings]);

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
        <NavHeaderBase navigation={navigation} title="Café" />

        {!!product && (
          <View style={styles.content}>
            <Spacer />

            {IS_THE_OWNER && (
              <>
                <View style={styles.viewActions}>
                  <Touchable onPress={handlePrivacy}>
                    <Eye
                      fill="black"
                      height={35}
                      width={35}
                      status={IS_THE_OWNER?.status}
                    />
                  </Touchable>
                  <Spacer size="smallWidth" />
                  <Touchable
                    onPress={() =>
                      navigation.navigate('registerNote', {
                        id: IS_THE_OWNER?.id,
                      })
                    }>
                    <Image style={styles.pencil} source={PENCIL} />
                  </Touchable>
                </View>

                <Spacer />
              </>
            )}

            <View style={styles.sessionImage}>
              <Image
                style={styles.image}
                source={{
                  uri: product?.attachments?.[0]?.uri,
                }}
              />

              <Spacer size="smaller" />

              <Text format="title"> {product.name}</Text>
              <Text format="body">{product.format}</Text>
            </View>

            <Spacer />

            <View style={styles.greenBox}>
              <View style={styles.viewBoxTitle}>
                <Text style={styles.boxTitle}>Informações do café</Text>
              </View>
              <Attribute label="Marca" value={product.brand} />
              <Spacer size="nano" />
              <Attribute label="Espécie" value={product.specie} />
              <Spacer size="nano" />
              {/* <Attribute
                label="Variedade"
                value={product.variety?.name || '-'}
              />
              <Spacer size="nano" /> */}
              <Attribute label="Fazenda" value={product.farm} />
              <Spacer size="nano" />
              <Attribute label="Região" value={product.region} />
              <Spacer size="nano" />
              <Attribute label="Altitude" value={product.altitude + 'm'} />
              <Spacer size="nano" />
              <Attribute
                label="Processo de secagem"
                value={product.dryingProcess}
              />
              <Spacer size="nano" />
              <Attribute
                label="Notas sensoriais"
                value={product.sensoryNotes}
              />
              <Spacer size="nano" />
              <View style={styles.info}>
                <Text style={[{fontWeight: 'bold'}]}>Torra:</Text>
                <Spacer size="nanoWidth" />
                <Roast value={product.roast} />
              </View>
              <Spacer size="nano" />
              <View style={[styles.info, {justifyContent: 'space-between'}]}>
                <Text style={[{fontWeight: 'bold'}]}>Avaliação média</Text>
                <Spacer size="nanoWidth" />
                <Text>{`(${product.avgRating || 0})`}</Text>
              </View>
            </View>

            <Spacer />

            <View style={styles.viewFilterButtons}>
              <Touchable
                onPress={() => setSelectedFilter('rating')}
                style={[
                  styles.btnFilter,
                  {
                    backgroundColor:
                      selectedFilter === 'rating'
                        ? colors.primary
                        : colors.lightGreen,
                  },
                ]}>
                <Text>Avaliações</Text>
              </Touchable>

              <Spacer size="nanoWidth" />

              <Touchable
                onPress={() => setSelectedFilter('merchant')}
                style={[
                  styles.btnFilter,
                  {
                    backgroundColor:
                      selectedFilter === 'merchant'
                        ? colors.primary
                        : colors.lightGreen,
                  },
                ]}>
                <Text>Estabelecimentos</Text>
              </Touchable>
            </View>

            <Spacer />

            {selectedFilter === 'merchant' ? (
              <>
                <View style={styles.constainerRatings}>
                  {product.merchants.length > 0 ? (
                    product.merchants
                      .filter(item => item.status === 1)
                      .map((merchant, index) => (
                        <Touchable
                          onPress={() =>
                            navigation.navigate('profileView', {
                              id: merchant.userId,
                            })
                          }
                          key={index}
                          style={styles.rating}>
                          <View style={styles.ratingProfile}>
                            <Image
                              style={styles.avatarMerchant}
                              source={
                                merchant.user?.profile?.avatar
                                  ? {uri: merchant.user?.profile?.avatar}
                                  : AVATAR
                              }
                            />
                          </View>

                          <Spacer size="smallWidth" />

                          <View style={styles.ratingComment}>
                            <Text format="bodyBold">{merchant.user?.name}</Text>
                            <Text format="bodySmall">
                              @{merchant.user?.username}
                            </Text>
                            <Spacer size="nano" />
                            <View style={styles.viewLocation}>
                              <MapMarker fill="black" />
                              <Text format="bodySmall">
                                {merchant.user?.profile?.location}
                              </Text>
                            </View>
                          </View>
                        </Touchable>
                      ))
                  ) : (
                    <Text>Nenhum estabelecimento encontrado</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.constainerRatings}>
                  {product.ratings.length > 0 &&
                    product.ratings.map((rating, index) => (
                      <View key={index} style={styles.rating}>
                        <Touchable
                          style={styles.ratingProfile}
                          onPress={() =>
                            navigation.navigate('profileView', {
                              id: rating.user.id,
                            })
                          }>
                          <Image
                            style={styles.avatarRating}
                            source={
                              rating.user?.profile?.avatar
                                ? {uri: rating.user?.profile?.avatar}
                                : AVATAR
                            }
                          />
                          <Text format="bodySmallBold">
                            @{rating.user?.username}
                          </Text>
                        </Touchable>

                        <Spacer size="nanoWidth" />

                        <View style={styles.ratingComment}>
                          <Text>{rating.comment}</Text>
                          <Spacer size="nano" />

                          <Rating value={rating.stars} />
                        </View>
                      </View>
                    ))}
                </View>
                {user?.pv === 0 && (
                  <Button
                    style={styles.buttonComment}
                    text="Comentar"
                    onPress={() => setIsOpenModal(true)}
                  />
                )}
              </>
            )}

            <Spacer />

            <NewCommentModal
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
              productId={product.id}
              setRatings={setRatings}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Product;

const Attribute = ({label, value}) => {
  return (
    <View style={styles.info}>
      <Text style={[{fontWeight: 'bold'}]}>{label + ':'}</Text>
      <Spacer size="nanoWidth" />
      <Text> {value} </Text>
    </View>
  );
};

const Roast = ({value}) => {
  return (
    <View style={styles.containerLevel}>
      <View style={styles.selectLevelCoffee}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <Touchable key={index} onPress={() => console.log('roast', item)}>
            <Image
              source={
                item <= value ? COFFEE_BEAN_SELECTED_IMAGE : COFFEE_BEAN_IMAGE
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
  );
};

const NewCommentModal = ({
  isOpenModal,
  setIsOpenModal,
  productId,
  setRatings,
}) => {
  const INITIAL_VALUES = {
    comment: '',
    stars: '',
  };

  const user = useAuth()[0].data;

  const validationSchema = Yup.object({
    comment: Yup.string().required('Campo obrigatório'),
    stars: Yup.string().required('Campo obrigatório'),
  });

  const onRegister = async values => {
    try {
      await api.post(`/product/${productId}/rating?userId=${user.id}`, values);

      resetForm();
      setValues(INITIAL_VALUES);
      setIsOpenModal(false);
      setRatings(prev => [...prev, values]);
    } catch (error) {
      console.log(error);
      onError(error);
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
    resetForm,
  } = useFormik({
    onSubmit: onRegister,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  return (
    <View>
      <ModalBase isVisible={isOpenModal} setIsVisible={setIsOpenModal}>
        <View style={{alignItems: 'center'}}>
          <Text style={{width: '70%', textAlign: 'center'}} format="title">
            Qual a sua avaliação para esse café?
          </Text>
          <Spacer size="nano" />
          <Rating
            value={values.stars}
            onChange={value => setFieldValue('stars', value)}
          />
          {touched.stars && errors.stars && (
            <Text style={styles.error} format="error">
              {errors.stars}
            </Text>
          )}
          <Spacer size="smaller" />
        </View>
        <Text format="labelInput">Deixe seu comentário</Text>
        <InputProfile
          styleInput={{width: '100%', height: 100, flexWrap: 'wrap'}}
          value={values.comment}
          autoCapitalize="none"
          onBlur={() => handleBlur('comment')}
          onChangeText={handleChange('comment')}
          error={touched.comment && errors.comment}
          placeholder=""
        />
        <Spacer />
        <Button
          style={styles.buttonComment}
          text="Publicar avaliação"
          disabled={isSubmitting}
          onPress={handleSubmit}
          loading={isSubmitting}
        />

        <Spacer />
      </ModalBase>
    </View>
  );
};
