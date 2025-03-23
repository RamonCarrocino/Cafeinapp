import React, {useContext} from 'react';
import {NavigationContainer, TabActions} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Context} from '../services';
import {AUTH_STATUS} from '../state';

import Login from '../screens/login';
import AccountType from '../screens/accountType';
import Register from '../screens/register';
import PasswordRecovery from '../screens/passwordRecovery';

import Home from '../screens/home';
import RegisterNote from '../screens/registerNote';
import Search from '../screens/search';
import Grade from '../screens/grade';
import Product from '../screens/product';
import Profile from '../screens/profile';
import EditProfile from '../screens/profile/edit';
import Relation from '../screens/relation';
import Glossary from '../screens/glossary';
import MedalSystem from '../screens/medalSystem';
import Notification from '../screens/notification';
import Map from '../screens/map';
import RequestVerification from '../screens/requestVerification';

import {TabBar} from '../components/molecules';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Routes = () => {
  const [globalState] = useContext(Context);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {backgroundColor: 'black'},
        }}>
        {
          {
            [AUTH_STATUS.INITIAL]: (
              <Stack.Screen name={'initial'}>{() => null}</Stack.Screen>
            ),

            [AUTH_STATUS.NONE]: (
              <>
                <Stack.Screen name={'login'} component={Login} />
                <Stack.Screen name={'accountType'} component={AccountType} />
                <Stack.Screen name={'register'} component={Register} />
                <Stack.Screen
                  name={'passwordRecovery'}
                  component={PasswordRecovery}
                />
              </>
            ),

            [AUTH_STATUS.AUTHORIZED]: (
              <>
                <Stack.Screen name={'tabNavigator'}>
                  {() => (
                    <Tab.Navigator
                      screenOptions={{headerShown: false}}
                      tabBar={TabBar}>
                      <Stack.Screen name={'home'} component={Home} />
                      <Stack.Screen name={'search'} component={Search} />
                      <Stack.Screen
                        name={'registerNote'}
                        component={RegisterNote}
                      />

                      <Stack.Screen name={'map'} component={Map} />

                      <Stack.Screen name={'profile'} component={Profile} />
                    </Tab.Navigator>
                  )}
                </Stack.Screen>

                <Stack.Screen name={'grade'} component={Grade} />
                <Stack.Screen name={'product'} component={Product} />
                <Stack.Screen name={'profileView'} component={Profile} />
                <Stack.Screen name={'profile/edit'} component={EditProfile} />
                <Stack.Screen name={'relation'} component={Relation} />
                <Stack.Screen name={'glossary'} component={Glossary} />
                <Stack.Screen name={'medalSystem'} component={MedalSystem} />
                <Stack.Screen name={'notification'} component={Notification} />
                <Stack.Screen
                  name={'requestVerification'}
                  component={RequestVerification}
                />
              </>
            ),
          }[globalState.status]
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
