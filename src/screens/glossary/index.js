import React, {useEffect} from 'react';
import {ScrollView, View, useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {Text} from '../../components/atoms';
import {NavHeaderBase} from '../../components/organisms';
import {api} from '../../services';

import {styles} from './styles';

export default function Glossary({navigation}) {
  const {width} = useWindowDimensions();

  const [glossary, setGlossary] = React.useState({
    html: `
    <p style='text-align:center;'>
      ...
    </p>`,
  });

  useEffect(() => {
    (async () => {
      const {data: resp} = await api.get('settings');

      setGlossary({html: resp.data.glossary});
    })();
  }, []);
  return (
    <View style={styles.container}>
      <NavHeaderBase navigation={navigation} title="Glossário" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <RenderHtml
            baseStyle={{color: 'black'}}
            contentWidth={width}
            source={glossary}
          />
        </View>
      </ScrollView>
    </View>
  );
}
