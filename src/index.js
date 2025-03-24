import {Platform, UIManager} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useEffect, useCallback, useReducer} from 'react';
import OneSignal from 'react-native-onesignal';
import {LoginManager, Settings} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';

GoogleSignin.configure();

import Routes from './routes';
import {storage} from './helpers';
import {api, Context} from './services';
import {actions, INITIAL_STATE, reducer} from './state';
import {config} from './assets/others';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const init = useCallback(async () => {
    try {
      const {data} = await storage.getData();

      if (data !== null && data.id) {
        api.defaults.headers.authorization = 'Bearer ' + data.token;

        dispatch({type: actions.AUTH_LOGIN, payload: {...data}});
      } else {
        dispatch({type: actions.AUTH_NONE});
      }
    } catch (e) {
      dispatch({type: actions.AUTH_NONE});
    }
  }, []);

  const celularDoRamon = 'd5380d7e-f005-4cc0-a363-392d3fb1aab7';
  const celularDoVladimir = 'b0d6acfa-3f1e-4071-bd1f-0caac2279ac0';

  useEffect(() => {
    init();
    // mobileAds()
    //   .initialize()
    //   .then(adapterStatuses => {
    //     console.log('adapterStatuses', adapterStatuses);
    //   });

    // mobileAds()
    //   .setRequestConfiguration({
    //     // Update all future requests suitable for parental guidance
    //     maxAdContentRating: MaxAdContentRating.PG,

    //     // Indicates that you want your content treated as child-directed for purposes of COPPA.
    //     tagForChildDirectedTreatment: false,

    //     // Indicates that you want the ad request to be handled in a
    //     // manner suitable for users under the age of consent.
    //     tagForUnderAgeOfConsent: false,

    //     // An array of test device IDs to allow.
    //     testDeviceIdentifiers: ['EMULATOR', celularDoRamon, celularDoVladimir],
    //   })
    //   .then(() => {
    //     // Request config successfully set!
    //   });
  }, [init]);

  const onNotificationRecieved = useCallback(event => {
    const notification = event.getNotification();
    console.log('OneSignal: notification received: ', notification);
    event.complete(notification);
  }, []);

  const onNotificationOpened = useCallback(notification => {
    console.log('OneSignal: notification opened: ', notification);
  }, []);

  const onSubscriptionChanged = useCallback(event => {
    console.log('OneSignal: subscription changed from: ', event.from);
    console.log('OneSignal: subscription changed to: ', event.to);
  }, []);

  const onPromptForPushNotifications = useCallback(response => {
    console.log('Prompt response:', response);
  }, []);

  useEffect(() => {
    GoogleSignin.configure();

    Settings.initializeSDK();
    Settings.setAppID('947055676448977');

    const loadOneSignal = async () => {
      OneSignal.setAppId(config.oneSignal);
      OneSignal.promptForPushNotificationsWithUserResponse(
        onPromptForPushNotifications,
      );
      OneSignal.addSubscriptionObserver(onSubscriptionChanged);
      OneSignal.setNotificationOpenedHandler(onNotificationOpened);
      OneSignal.setNotificationWillShowInForegroundHandler(
        onNotificationRecieved,
      );
    };

    loadOneSignal();

    return () => {
      OneSignal.clearHandlers();
    };
  }, [
    onSubscriptionChanged,
    onNotificationOpened,
    onNotificationRecieved,
    onPromptForPushNotifications,
  ]);

  return (
    <Context.Provider value={[state, dispatch]}>
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
    </Context.Provider>
  );
};

export default App;
