import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Attachment from '../../components/Attachment';
import { SCREEN_HEIGHT, fs, hp, wp } from '../../utils/config';
import { theme } from '../../utils/theme';

type ChatInputprops = {
  message: string;
  attachements: Array<any>;
  onUploaded: any;
  onDelete: any;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  pickFile: (event: GestureResponderEvent) => void;
  handleSendMessage: (event: GestureResponderEvent) => void;
};
const ChatInput = ({
  pickFile,
  message,
  setMessage,
  attachements,
  onUploaded,
  onDelete,
  handleSendMessage,
}: ChatInputprops) => {
  const styles = StyleSheet.create({
    mainContainer: {
      borderTopWidth: wp(2),
      borderTopColor: '#f4f4f4',
      backgroundColor: theme.SimpuPaleWhite,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },

    attachContainer: {
      paddingHorizontal: hp(20),
      paddingVertical: hp(10),
    },
    inputContainer: {
      height: SCREEN_HEIGHT * 0.1,
      paddingHorizontal: hp(20),
      paddingVertical: hp(10),
      flexDirection: 'row',
      // backgroundColor:'red'
      //  alignItems: 'center',
    },
    input: {
      fontSize: fs(16),
      flex: 1,
      color: theme.SimpuBlack,
      // backgroundColor:'green'
    },
    btnContainer: {
      flexDirection: 'row',
      // backgroundColor:'blue'
    },
    btns: {
      marginHorizontal: hp(8),
    },
  });
  return (
    <View style={styles.mainContainer}>
      {attachements?.length > 0 && (
        <View style={styles.attachContainer}>
          {attachements?.map((attach, index: number) => (
            <Attachment
              attach={attach}
              key={`${index}`}
              onUploaded={onUploaded}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Write your message"
          placeholderTextColor={theme.SimpuBlack}
          style={styles.input}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btns} onPress={pickFile}>
            <Image
              style={{ height: hp(25), width: hp(25) }}
              source={require('../../assets/attach.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btns, { marginRight: wp(5) }]}
            onPress={handleSendMessage}
          >
            <Image
              style={{ height: hp(25), width: hp(25) }}
              source={require('../../assets/send.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatInput;
