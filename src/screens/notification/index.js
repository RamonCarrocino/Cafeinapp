import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

import {api} from '../../services';
import AVATAR from './../../assets/images/avatar.png';
import {NavHeaderBase} from '../../components/organisms';
import {Loader, Spacer, Text, Touchable} from '../../components/atoms';

require('dayjs/locale/pt-br');
dayjs.locale('pt-br');

import {styles} from './styles';

export default function Notification({navigation}) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const {data: resp} = await api.get('/notification');
        setNotifications(resp.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <NavHeaderBase navigation={navigation} title="Notificações" />

          <View style={styles.content}>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {notifications.length === 0 ? (
                  <Text>Sem notificações</Text>
                ) : (
                  notifications.map((notification, index) => (
                    <Touchable style={styles.containerNotification}>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <Image
                          style={styles.avatar}
                          source={
                            false
                              ? {
                                  uri: 'item?.profile?.avatar',
                                }
                              : AVATAR
                          }
                        />
                        <Spacer size="nanoWidth" />
                        <View style={{flex: 1}}>
                          <Text style={{flex: 1}} format="labelInput">
                            {notification.title}
                          </Text>
                          <Text style={{flex: 1}}>{notification.message}</Text>
                        </View>
                      </View>

                      <Text format="bodySmall">
                        {dayjs(notification.createdAt).format('DD [de] MMM')}
                      </Text>
                    </Touchable>
                  ))
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
