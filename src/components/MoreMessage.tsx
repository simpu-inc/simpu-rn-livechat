import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import { fs, hp, SCREEN_WIDTH } from '../utils/config';




type moreMessagePropsType = {
  position?: 'top' | 'bottom';
};

const MoreMessage = ({position}: moreMessagePropsType) => {



  const styles = StyleSheet.create({
    container: {
      zIndex: 100,
      position: 'absolute',
      ...(position === 'top' && {top: SCREEN_WIDTH * 0.035}),
      ...(position === 'bottom' && {bottom: SCREEN_WIDTH * 0.12}),
      left: '35%',
      right: '40%',
      height: hp(25),
      width: hp(135),
      borderRadius: hp(10),
      backgroundColor: "#fff",
      alignItems: 'center',
      justifyContent: 'center',

      //shadow style
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.21,

      elevation: 1,
    },
    messageText: {
      color: '#000',
      fontSize: fs(12),
      textAlign: 'center',
    },
  });
  return (
    <View
      style={styles.container}>
      <Text style={styles.messageText}>
        Older Messages
      </Text>
    </View>
  );
};

export default memo(MoreMessage);
