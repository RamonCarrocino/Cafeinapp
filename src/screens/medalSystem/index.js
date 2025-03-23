import React, {useEffect} from 'react';
import {ScrollView, View, useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {Text} from '../../components/atoms';
import {NavHeaderBase} from '../../components/organisms';
import {api} from '../../services';

import {styles} from './styles';

export default function MedalSystem({navigation}) {
  const {width} = useWindowDimensions();

  const [medalSystem, setMedalSystem] = React.useState({
    html: `
    <p style='text-align:center;'>
      ...
    </p>`,
  });

  useEffect(() => {
    (async () => {
      const {data: resp} = await api.get('settings');

      setMedalSystem({html: resp.data.medalSystem});
    })();
  }, []);
  return (
    <View style={styles.container}>
      <NavHeaderBase navigation={navigation} title="Medalhas" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <RenderHtml
            baseStyle={{color: 'black'}}
            contentWidth={width}
            source={medalSystem}
          />
        </View>
      </ScrollView>
    </View>
  );
}
