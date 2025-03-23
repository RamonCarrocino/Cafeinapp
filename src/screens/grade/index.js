import React, {useState, useEffect} from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, View, ScrollView, Image, Platform} from 'react-native';

import styles from './styles';
import {api, useAuth} from '../../services';
import {Eye, SaveIcon} from '../../assets/svg/icons';
import {NavHeaderBase} from '../../components/organisms';
import {Text, Spacer, Touchable, Loader} from '../../components/atoms';
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryTheme,
} from 'victory-native';

const AVATAR = require('./../../assets/images/avatar.png');
const PENCIL = require('./../../assets/images/icons/pencil.png');
const COFFEE_BEAN_IMAGE = require('./../../assets/images/coffeeBean.png');
const COFFEE_BEAN_SELECTED_IMAGE = require('./../../assets/images/coffeeBeanSelected.png');

const Grade = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [grade, setGrade] = useState();
  const [options, setOptions] = useState();

  const [pData, setPdata] = useState();
  const [maxima, setMaxima] = useState();

  const user = useAuth()[0].data;

  const getMaxima = data => {
    const groupedData = Object.keys(data[0]).reduce((memo, key) => {
      memo[key] = data.map(d => d[key]);
      return memo;
    }, {});

    return Object.keys(groupedData).reduce((memo, key) => {
      memo[key] = Math.max(...groupedData[key]);
      return memo;
    }, {});
  };

  const processData = data => {
    const maxByGroup = getMaxima(data);

    const makeDataArray = d => {
      return Object.keys(d).map(key => {
        return {x: key, y: d[key] / maxByGroup[key]};
      });
    };
    return data.map(datum => makeDataArray(datum));
  };

  // useEffect(() => {
  //   setPdata(processData(characterData));
  //   setMaxima(getMaxima(characterData));
  // }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const {data: resp} = await api.get(`/grade/${route.params.gradeId}`);

        let sensories = {};
        let maxSensories = {};

        resp.data.sensorys.forEach(item => {
          sensories[item.sensory.name] = item.value > 0 ? item.value : 1;
          maxSensories[item.sensory.name] = 6;
        });

        setPdata(processData([sensories, maxSensories]));
        setMaxima(getMaxima([sensories, maxSensories]));

        setGrade({
          ...resp.data,
          isFavorite: resp.data?.favorites.length > 0 ? true : false,
          price: !!resp.data?.price && Number(resp.data.price).toFixed(2),
        });

        const {data: respOptions} = await api.get('/grade-options');
        setOptions(respOptions.data);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error ', error);
      }
    };

    getData();
  }, []);

  const handleFavorite = async () => {
    try {
      await api.put(`/grade/favorite/${grade.id}`);
      setGrade({...grade, isFavorite: !grade.isFavorite});
    } catch (error) {
      console.log('Error ', error);
    }
  };

  const handlePrivacy = async () => {
    try {
      await api.put(`/grade/privacy/${grade.id}`);
      setGrade({...grade, status: grade.status === 1 ? 0 : 1});
    } catch (error) {
      console.log('Error ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <NavHeaderBase navigation={navigation} title="Avaliação" />
        {isLoading ? (
          <Loader />
        ) : grade?.user ? (
          <View style={styles.content}>
            <Spacer />
            <View style={styles.containerProfile}>
              <Touchable
                onPress={() =>
                  navigation.navigate('profileView', {id: grade.user.id})
                }
                style={styles.profile}>
                <Image
                  style={styles.avatar}
                  source={
                    grade.user?.profile?.avatar
                      ? {uri: grade.user?.profile?.avatar}
                      : AVATAR
                  }
                />

                <Spacer size="nanoWidth" />

                <View>
                  <Text format="labelInput">{grade.user?.name}</Text>
                  <Text> {grade.user?.username} </Text>
                </View>
              </Touchable>
              <View style={styles.containerIcons}>
                <Touchable onPress={handleFavorite}>
                  <SaveIcon fill={grade.isFavorite ? '#000' : '#fff'} />
                </Touchable>

                {user.id === grade.user.id && (
                  <>
                    <Spacer size="smallWidth" />

                    <Touchable onPress={handlePrivacy}>
                      <Eye
                        fill="black"
                        height={35}
                        width={35}
                        status={grade?.status}
                      />
                    </Touchable>
                    {/* <Spacer size="smallWidth" /> */}

                    <Touchable
                      onPress={() =>
                        navigation.navigate('registerNote', grade)
                      }>
                      <Image style={styles.pencil} source={PENCIL} />
                    </Touchable>
                  </>
                )}
              </View>
            </View>

            <Spacer />

            <View style={styles.sessionImage}>
              <Image
                style={styles.image}
                source={{
                  uri:
                    grade.attachment || grade?.product?.attachments?.[0]?.uri,
                }}
              />

              <Spacer size="smaller" />

              <Text format="title"> {grade.product.name} </Text>
              <Text format="body">
                {' '}
                R$ {grade.price} /{grade.weight}g
              </Text>
              <Text format="body">{grade?.format}</Text>
            </View>

            <Spacer />

            <View style={styles.greenBox}>
              <View style={styles.viewBoxTitle}>
                <Text style={styles.boxTitle}>Informações do café</Text>
              </View>
              <Attribute label="Marca" value={grade.product.brand} />
              <Spacer size="nano" />
              <Attribute label="Espécie" value={grade.product.specie} />
              <Spacer size="nano" />
              {/* <Attribute
                label="Variedade"
                value={grade.product.variety?.name || '-'}
              />
              <Spacer size="nano" /> */}
              <Attribute label="Pontuação" value={grade.punctuation} />
              <Spacer size="nano" />
              <Attribute label="Fazenda" value={grade.product.farm} />
              <Spacer size="nano" />
              <Attribute label="Região" value={grade.product.region} />
              <Spacer size="nano" />
              <Attribute
                label="Altitude"
                value={grade.product.altitude + 'm'}
              />
              <Spacer size="nano" />
              <Attribute
                label="Processo de secagem"
                value={grade.product.dryingProcess}
              />
              <Spacer size="nano" />
              <Attribute label="Safra" value={grade.harvest} />
              <Spacer size="nano" />
              <Attribute
                label="Notas sensoriais"
                value={grade.product.sensoryNotes}
              />
            </View>

            <Spacer />

            <View style={styles.greenBox}>
              <View style={styles.viewBoxTitle}>
                <Text style={styles.boxTitle}>Receita</Text>
              </View>
              <Attribute
                label="Qtd. de café"
                value={grade.coffeeAmount + 'g'}
              />
              <Spacer size="nano" />
              <Attribute
                label="Qtd. de água"
                value={grade.waterAmount + 'ml'}
              />
              <Spacer size="nano" />
              <Attribute
                label="Temperatura da água"
                value={grade.waterTemperature + '°C'}
              />
              <Spacer size="nano" />
              <Attribute
                label="Tempo de extração"
                value={grade.extrationTime + 'm'}
              />
              <Spacer size="nano" />
              <Attribute label="Método" value={grade.method?.name} />
              <Spacer size="nano" />
              <View style={styles.boxSlider}>
                <Text style={{marginTop: 2, fontWeight: 'bold'}}>Moagem: </Text>

                <Spacer size="nanoWidth" />

                <View style={{flex: 1}}>
                  <Slider
                    value={grade.milling}
                    minimumValue={0}
                    maximumValue={4}
                    trackMarks={[0, 1, 2, 3, 4]}
                    disabled={true}
                  />
                  <View style={styles.labelsMillings}>
                    <Text>fino</Text>
                    <Text>médio</Text>
                    <Text>grosso</Text>
                  </View>
                </View>
              </View>
              <Spacer size="nano" />
              <View style={styles.info}>
                <Text style={[{fontWeight: 'bold'}]}>Torra:</Text>
                <Spacer size="nanoWidth" />
                <Roast value={grade.product.roast - 1} />
              </View>
            </View>

            <Spacer />

            <View style={[styles.greenBox, {alignItems: 'center'}]}>
              <View style={styles.viewBoxTitle}>
                <Text style={styles.boxTitle}>Sensorial</Text>
              </View>

              <Spacer size="xs" />

              <Text>{grade.comments}</Text>

              <VictoryChart
                polar
                theme={VictoryTheme.material}
                domain={{y: [0, 1]}}>
                <VictoryGroup
                  colorScale={['#7d0800', 'transparent']}
                  style={{data: {fillOpacity: 1, strokeWidth: 2}}}>
                  {pData.map((data, i) => {
                    return <VictoryArea key={i} data={data} />;
                  })}
                </VictoryGroup>
                {Object.keys(maxima).map((key, i) => {
                  return (
                    <VictoryPolarAxis
                      key={i}
                      dependentAxis
                      style={{
                        axisLabel: {padding: 10},
                        axis: {stroke: 'none'},
                        grid: {stroke: 'grey', strokeWidth: 0.25, opacity: 0.5},
                        tickLabels: {
                          fill: 'none',
                        },
                      }}
                      tickLabelComponent={
                        <VictoryLabel labelPlacement="vertical" />
                      }
                      labelPlacement="perpendicular"
                      axisValue={i + 1}
                      label={key}
                      tickFormat={t => Math.ceil(t * maxima[key])}
                      tickValues={[0.25, 0.5, 0.75]}
                    />
                  );
                })}
                <VictoryPolarAxis
                  labelPlacement="parallel"
                  tickFormat={() => ''}
                  style={{
                    axis: {stroke: 'none'},
                    grid: {stroke: 'grey', opacity: 0.5},
                  }}
                />
              </VictoryChart>
            </View>

            <Spacer />
          </View>
        ) : (
          <Text>Nota não encontrada</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Grade;

const Attribute = ({label, value}) => {
  return (
    <View style={styles.info}>
      <Text style={[{fontWeight: 'bold'}]}>{label + ':'}</Text>
      <Text> {value} </Text>
    </View>
  );
};

const Roast = ({value}) => {
  return (
    <View style={styles.containerLevel}>
      <View style={styles.selectLevelCoffee}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <Touchable key={index} onPress={() => console.log('roast', index)}>
            <Image
              source={
                index <= value ? COFFEE_BEAN_SELECTED_IMAGE : COFFEE_BEAN_IMAGE
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
