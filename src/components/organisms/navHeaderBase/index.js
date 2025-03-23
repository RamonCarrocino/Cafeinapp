import React, {useEffect} from 'react';
import {View, Image, Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {GoBack, ModalBase} from '../../molecules';
import {Spacer, Text, Touchable} from '../../atoms';
import {
  Exit,
  LeftChevron,
  Menu,
  Notification,
  ShoppingCart,
} from '../../../assets/svg/icons';

import openBook from '../../../assets/images/icons/openBook.png';
import medal from '../../../assets/images/icons/medal.png';
import help from '../../../assets/images/icons/help.png';
import exit from '../../../assets/images/icons/exit.png';

import styles from './styles';
import {actions} from '../../../state';
import {storage} from '../../../helpers';
import {useAuth} from '../../../services';

const NavHeaderBase = ({goBack = true, title, navigation}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [, globalDispatch] = useAuth();

  const logout = async () => {
    await storage.clean();
    await globalDispatch({type: actions.AUTH_LOGOUT});
    LoginManager.logOut();
    await GoogleSignin.signOut();
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.header}>
      <ModalBase
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        position="right"
        style={styles.containerModal}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        flex={1}>
        <Touchable style={styles.btnClose} onPress={() => setIsVisible(false)}>
          <LeftChevron
            fill={'#000'}
            width={styles.chevron.width}
            height={styles.chevron.height}
          />
        </Touchable>

        <Spacer size="small" />

        <Touchable
          style={styles.containerOption}
          onPress={() => navigation.navigate('glossary')}>
          <View style={styles.imageOption}>
            <Image source={openBook} />
          </View>
          <Text format="labelInput">Glossário</Text>
        </Touchable>

        <Touchable
          style={styles.containerOption}
          onPress={() => navigation.navigate('medalSystem')}>
          <View style={styles.imageOption}>
            <Image source={medal} />
          </View>
          <Text format="labelInput">Medalhas</Text>
        </Touchable>
        <Spacer size="small" />

        <Touchable
          onPress={() => Linking.openURL('mailto:contato@cafeinapp.com.br')}
          style={styles.containerOption}>
          <View style={styles.imageOption}>
            <Image source={help} />
          </View>
          <Text format="labelInput">Fale conosco</Text>
        </Touchable>
        <Spacer />

        <Touchable style={styles.containerOption} onPress={logout}>
          <View style={styles.imageOption}>
            <Image source={exit} />
          </View>

          <Text format="labelInput">Sair</Text>
        </Touchable>
      </ModalBase>

      <View style={styles.headerBar}>
        {goBack ? (
          <GoBack onPress={() => navigation.dispatch(CommonActions.goBack())} />
        ) : (
          <View style={{width: 25}} />
        )}

        <Text format="title" style={styles.headerTitle}>
          {title}
        </Text>

        <View style={styles.headerIcons}>
          <Touchable onPress={() => navigation.navigate('notification')}>
            <Notification />
          </Touchable>

          <Touchable onPress={() => setIsVisible(!isVisible)}>
            <Menu />
          </Touchable>
        </View>
      </View>
    </View>
  );
};

export default React.memo(NavHeaderBase);
