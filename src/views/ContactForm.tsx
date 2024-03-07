import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { theme } from '../utils/theme';
import PhoneInput from 'react-native-phone-number-input';
import { useChatProvider } from '../context';
import { SCREEN_HEIGHT, fs, hp, wp } from '../utils/config';
import { addOrUpdateUser, getUserHash, sendMessage } from '../utils';

const ContactForm = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const { AppId, publicKey, setViewIndex, orgSettings } = useChatProvider();

  console.log({ formattedValue, value });

  const [formDetails, setFormDetails] = useState({
    name: '',
    email: '',
    message: '',
  });

  const SendMessage = async () => {
    const hash = getUserHash({
      public_key: publicKey,
      secret_key: orgSettings?.secret_key,
      user_id: undefined,
    });

    // console.log('User Hash: ' + hash);

    try {
      // const { name, email, phone, message } = values;

      // setIsSubmittingContactForm(true);

      const { uuid, user_id } = await addOrUpdateUser({
        data: {
          name: formDetails?.name,
          email: formDetails?.email,
          phone: formattedValue,
        },
        app_id: AppId,
        signed_request: hash,
      });

      console.log('response from add user', { uuid, user_id });

      const user_hash = getUserHash({
        user_id,
        public_key: publicKey,
        secret_key: orgSettings?.secret_key,
      });

      console.log('response generate user', { user_hash });
      // saveState({
      //   ...(loadState() ?? {}),
      //   uuid,
      //   user_id,
      //   signed_request: user_hash,
      // });

      // initializePusher({ app_id, user_hash, user_id });

      const { session_id } = await sendMessage(
        {
          content: formDetails?.message,
        },
        AppId
      );

      console.log('Session ID===', { session_id });

      setViewIndex(3);
      // setIsSubmittingContactForm(false);
      // resetForm({ name: '', email: '', phone: '', message: '' });
      // setHomeSectionStep(0);
      // history.push(`/chat/${session_id}`);
    } catch (error) {
      alert(error);
      console.log(error);
      // setIsSubmittingContactForm(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      height: SCREEN_HEIGHT * 0.65,
      marginTop: -SCREEN_HEIGHT * 0.05,
      marginHorizontal: wp(20),
      backgroundColor: theme.SimpuWhite,
      borderRadius: hp(10),
      padding: hp(10),
    },

    inputContainer: {
      marginVertical: hp(8),
      marginHorizontal: hp(15),
    },
    lable: {
      fontSize: fs(16),
      paddingVertical: hp(5),
    },
    input: {
      height: hp(55),
      borderWidth: 1,
      borderColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      borderRadius: hp(8),
      paddingHorizontal: hp(10),
      fontSize: fs(16),
    },
    sendBtn: {
      height: hp(45),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      marginHorizontal: wp(15),
      marginVertical: hp(20),
      borderRadius: hp(10),
    },
    sendBtnTxt: {
      color: theme.SimpuWhite,
      fontSize: fs(16),
      fontWeight: '600',
    },
  });
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: wp(15) }}>
        <Text
          style={{
            paddingVertical: hp(10),
            fontSize: fs(16),
            fontWeight: '500',
          }}
        >
          We'll like to know you!
        </Text>
      </View>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Name</Text>
          <TextInput
            value={formDetails?.name}
            onChangeText={(text) =>
              setFormDetails({ ...formDetails, name: text })
            }
            style={styles.input}
            placeholder="Enter your name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Email</Text>
          <TextInput
            value={formDetails?.email}
            onChangeText={(text) =>
              setFormDetails({ ...formDetails, email: text })
            }
            keyboardType="email-address"
            style={styles.input}
            placeholder="Enter your email"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Phone number</Text>
          {/* <TextInput
            keyboardType="number-pad"
            style={styles.input}
            placeholder="Enter your phone number"
          /> */}
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            placeholder="900000000"
            defaultCode="US"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            withDarkTheme={false}
            // withShadow
            autoFocus
            containerStyle={{
              borderWidth: 1,
              width: wp(310),
              borderColor:
                orgSettings?.style?.background_color ?? theme.SimpuBlue,
              borderRadius: hp(8),
              backgroundColor: 'transparent',
              // marginHorizontal: ,
              // height: 40,
            }}
            codeTextStyle={{
              fontSize: fs(16),
              padding: 0,
              margin: 0,
              // backgroundColor: 'red',
            }}
            textInputStyle={{
              margin: 0,
              fontSize: fs(16),
              padding: 0,
            }}
            // layout="first"
            textContainerStyle={{
              // height: 40,
              padding: 0,

              backgroundColor: 'transparent',
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Message</Text>
          <TextInput
            value={formDetails?.message}
            onChangeText={(text) =>
              setFormDetails({ ...formDetails, message: text })
            }
            multiline
            style={[styles.input, { height: hp(120) }]}
            placeholder="write your message"
          />
        </View>

        <TouchableOpacity style={styles.sendBtn} onPress={SendMessage}>
          <Text style={styles.sendBtnTxt}>Send message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactForm;
