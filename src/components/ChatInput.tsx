import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {deviceHeight} from '../utils/responsiveConfig';
import {theme} from '../utils/theme';

const ChatInput = () => {
  const styles = StyleSheet.create({
    inputContainer: {
      borderTopWidth: 2,
      borderTopColor: '#f4f4f4',
      backgroundColor: theme.SimpuPaleWhite,
      height: deviceHeight * 0.1,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: 'row',
      //  alignItems: 'center',
    },
    input: {
      fontSize: 16,
      flex: 1,
    },
    btnContainer: {
      flexDirection: 'row',
    },
    btns: {
      marginHorizontal: 8,
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
        <TouchableOpacity style={styles.btns} onPress={() => {}}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../assets/attach.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btns, {marginRight: 5}]}
          onPress={() => {}}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../assets/send.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;
