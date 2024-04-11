import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  KEY: 'SIMPU_LIVE_CHAT',
  SESSION_ID: 'SESSION_ID',
  UUID: 'UUID',
  USER_ID: 'USER_ID',
  SIGNED_REQUEST: 'SIGNED_REQUEST',
  COMPANY_CONFIG: 'COMPANY_CONFIG',
};

export const getCache = async (Key: string) => {
  try {
    return await AsyncStorage.getItem(Key);
  } catch (e) {
    // read error
  }
};

export const storeCache = async (Key: string, value: string) => {
  try {
    await AsyncStorage.setItem(Key, value);
  } catch (e) {
    // saving error
  }
};

export const storeCompanyConfig = async (key: string, value: Object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getCompanyConfig = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const clearCache = async (Key: string) => {
  try {
    await AsyncStorage.removeItem(Key);
  } catch (e) {
    // remove error
  }
};
