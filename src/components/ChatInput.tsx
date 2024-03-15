import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import { SCREEN_HEIGHT, fs, hp, wp } from '../utils/config';

type ChatInputprops = {
  pickFile: (event: GestureResponderEvent) => void;
  handleSendMessage: (event: GestureResponderEvent) => void;
};
const ChatInput = ({ pickFile }: ChatInputprops) => {
  const styles = StyleSheet.create({
    inputContainer: {
      borderTopWidth: wp(2),
      borderTopColor: '#f4f4f4',
      backgroundColor: theme.SimpuPaleWhite,
      height: SCREEN_HEIGHT * 0.1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: hp(20),
      paddingVertical: hp(10),
      flexDirection: 'row',
      //  alignItems: 'center',
    },
    input: {
      fontSize: fs(16),
      flex: 1,
    },
    btnContainer: {
      flexDirection: 'row',
    },
    btns: {
      marginHorizontal: hp(8),
    },
  });
  return (
    <View style={styles.inputContainer}>
      <TextInput
        multiline
        placeholder="Write your message"
        style={styles.input}
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btns} onPress={pickFile}>
          <Image
            style={{ height: hp(25), width: hp(25) }}
            source={require('../assets/attach.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btns, { marginRight: wp(5) }]}
          onPress={() => {}}
        >
          <Image
            style={{ height: hp(25), width: hp(25) }}
            source={require('../assets/send.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;
