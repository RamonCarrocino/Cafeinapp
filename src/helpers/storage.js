import AsyncStorage from '@react-native-async-storage/async-storage';

import {config} from '../assets/others';

const storeData = async (data = {}, metadata = {}) => {
  try {
    const temp = {
      data,
      metadata: {...metadata, createdAt: new Date(), VERSION: config.VERSION},
    };
    await AsyncStorage.setItem('@auth', JSON.stringify(temp));
    return true;
  } catch (e) {
    return false;
  }
};

const getData = async () => {
  try {
    const temp = JSON.parse(await AsyncStorage.getItem('@auth'));

    if (temp !== null) {
      const {metadata, data} = temp;

      return {metadata, data};
    }

    return {metadata: {}, data: null};
  } catch (e) {
    return {metadata: {}, data: null};
  }
};

const updateProfilePicture = async uri => {
  try {
    const {metadata, data} = await getData();

    data.profileImage = uri;

    await storeData(data, metadata);
    return true;
  } catch (e) {
    return false;
  }
};

const clean = async () => {
  try {
    const {metadata} = await getData();

    await storeData({}, metadata);
    return true;
  } catch (e) {
    return false;
  }
};

export default {
  storeData,
  getData,
  clean,

  updateProfilePicture,
};
