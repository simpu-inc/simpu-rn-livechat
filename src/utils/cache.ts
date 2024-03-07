import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'SIMPU_LIVE_CHAT';

export const saveToCache = async (value: Object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getCache = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const clearCache = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    // remove error
  }
};
