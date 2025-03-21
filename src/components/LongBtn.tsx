import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useChatProvider } from '../context';
import { fs, hp } from '../utils/config';
import { theme } from '../utils/theme';

const LongBtn = ({ handlePress ,btnTitle}: { btnTitle:string;handlePress: () => void }) => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    sendMsgBtn: {
      height: hp(44),
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: hp(10),
      marginHorizontal: hp(15),
      marginVertical: hp(10),
    },
    sendMsgTxt: {
      color: theme.SimpuWhite,
      fontSize: fs(16),
    },
  });
  return (
    <TouchableOpacity style={styles.sendMsgBtn} onPress={handlePress}>
      <Text style={styles.sendMsgTxt}>{btnTitle}</Text>
    </TouchableOpacity>
  );
};

export default LongBtn;
