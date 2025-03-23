import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';

import styles from './styles';
import {useAuth} from '../../services';
import {colors, config} from '../../assets/others';
import {NavHeaderBase} from '../../components/organisms';

import FormConsumer from './formConsumer';
import FormEstablishment from './formEstablishment';

const RegisterNote = ({navigation, route}) => {
  const isEdit = !!route.params?.id;

  const currentUser = useAuth()[0].data;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <KeyboardAvoidingView style={styles.keyboard} behavior={config.behavior}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <NavHeaderBase
            navigation={navigation}
            title={isEdit ? 'Editar' : 'Registar'}
          />

          {currentUser.pv === 0 ? (
            <FormConsumer
              key={'formCostumer'}
              navigation={navigation}
              route={route}
            />
          ) : (
            <FormEstablishment
              key={'formEstablishment'}
              navigation={navigation}
              route={route}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterNote;
