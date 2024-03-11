import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  KEY: 'SIMPU_LIVE_CHAT',
  SESSION_ID: 'SESSION_ID',
  SIGNED_REQUEST: 'SIGNED_REQUEST',
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

// export const saveToCache = async (value: Object) => {
//   try {
//     const jsonValue = JSON.stringify(value);
//     await AsyncStorage.setItem(KEY, jsonValue);
//   } catch (e) {
//     // saving error
//   }
// };

// export const getCache = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem(KEY);
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (e) {
//     // error reading value
//   }
// };

export const clearCache = async (Key: string) => {
  try {
    await AsyncStorage.removeItem(Key);
  } catch (e) {
    // remove error
  }
};
