import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { theme } from '../utils/theme';
import PhoneInput from 'react-native-phone-number-input';
import { useChatProvider } from '../context';
import { SCREEN_HEIGHT, fs, hp, wp } from '../utils/config';
import { addOrUpdateUser, getUserHash, sendMessage } from '../utils';
import { getCompanyConfig, KEYS, storeCache } from '../utils/cache';
import { z } from 'zod';
import { usePusherWebsocket } from '../Hooks/pusherSocket';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from '../components/KeyboardView';

const Message = z.object({
  name: z.string().min(3, { message: 'Name should be more than 3 characters' }),
  email: z.string().email({ message: 'Enter a valid Email address' }),
  phone: z.string().min(9, { message: 'Enter a valid phone number' }),
  message: z
    .string()
    .min(5, { message: 'Message should be more than 5 characters' }),
});

const ContactForm = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const {
    AppId,
    publicKey,
    setViewIndex,
    orgSettings,
    setSessionID,
    setUserHash,
  } = useChatProvider();
  const { pusherInit } = usePusherWebsocket();

  const [formattedValue, setFormattedValue] = useState('');
  const [formDetails, setFormDetails] = useState({
    name: '',
    email: '',
    message: '',
  });

  // console.log({ formattedValue, value });
  const [formatedErrors, setformatedErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const parsedMessage = Message.safeParse({
    ...formDetails,
    phone: formattedValue,
  });

  const SendMessage = async () => {
    const res = await getCompanyConfig();

    if (!parsedMessage.success) {
      const errors = parsedMessage?.error;

      let newErrors = {};

      for (const issue of errors.issues) {
        newErrors = {
          ...newErrors,
          [issue?.path?.[0]]: issue.message,
        };
      }
      setformatedErrors(newErrors);
    }

    if (!parsedMessage.success) return;
    setIsLoading(true);

    const hash = getUserHash({
      public_key: publicKey,
      secret_key: orgSettings?.secret_key,
      user_id: undefined!,
    });

    try {
      const { uuid, user_id } = await addOrUpdateUser({
        data: {
          name: formDetails?.name,
          email: formDetails?.email,
          phone: formattedValue,
        },
        app_id: AppId,
        signed_request: hash,
      });

      // console.log('response from add user', { uuid, user_id });

      const user_hash = getUserHash({
        user_id,
        public_key: publicKey,
        secret_key: orgSettings?.secret_key,
      });

      // console.log('response generate user', { user_hash });

      setUserHash(user_hash);

      // saveState({
      //   ...(loadState() ?? {}),
      //   uuid,
      //   user_id,
      //   signed_request: user_hash,
      // });

      await storeCache(KEYS.UUID, uuid);
      await storeCache(KEYS.SIGNED_REQUEST, user_hash);
      await storeCache(KEYS.USER_ID, user_id);

      // await storeCache(KEYS.SIGNED_REQUEST, user_hash);

      // initializePusher({ app_id, user_hash, user_id });
      pusherInit({ app_id: AppId, user_hash, user_id: user_id ?? '' });

      const { session_id } = await sendMessage(
        {
          body: formDetails?.message,
        },
        AppId,
        user_hash
      );

      // console.log('Session ID===', { session_id });

      setSessionID(session_id);
      setViewIndex(3);
      setIsLoading(false);
      // setIsSubmittingContactForm(false);
      // resetForm({ name: '', email: '', phone: '', message: '' });
      // setHomeSectionStep(0);
      // history.push(`/chat/${session_id}`);
    } catch (error) {
      // alert(error);
      console.log(error);
      // setIsSubmittingContactForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      height: SCREEN_HEIGHT * 0.65,
      marginTop:
        Platform.OS === 'android'
          ? -SCREEN_HEIGHT * 0.07
          : -SCREEN_HEIGHT * 0.04,
      marginHorizontal: wp(20),
      backgroundColor: theme.SimpuWhite,
      borderRadius: hp(10),
      padding: hp(10),
    },

    inputContainer: {
      marginVertical: hp(2),
      marginHorizontal: hp(15),
    },
    lable: {
      fontSize: fs(16),
      paddingVertical: hp(2),
      color: theme.SimpuBlack,
    },
    input: {
      height: hp(45),
      borderWidth: 1,
      color: theme.SimpuBlack,
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
      marginVertical: hp(10),
      borderRadius: hp(10),
    },
    sendBtnTxt: {
      color: theme.SimpuWhite,
      fontSize: fs(16),
      fontWeight: '600',
    },

    errorText: {
      fontSize: fs(10),
      color: 'red',
      marginLeft: wp(4),
      paddingTop: hp(4),
    },
  });
  return (
 
      <View style={styles.container}>
        <View style={{ paddingHorizontal: wp(15) }}>
          <Text
            style={{
              paddingVertical: hp(7),
              fontSize: fs(16),
              fontWeight: '500',
              color: theme.SimpuBlack,
            }}
          >
            We'll like to know you!
          </Text>
        </View>
        <KeyboardAwareScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.lable}>Name</Text>
            <TextInput
              value={formDetails?.name}
              onChangeText={(text) =>
                setFormDetails({ ...formDetails, name: text })
              }
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={theme.SimpuGray}
            />
            <Text style={styles.errorText}>{formatedErrors?.name}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.lable}>Email</Text>
            <TextInput
              value={formDetails?.email}
              placeholderTextColor={theme.SimpuGray}
              onChangeText={(text) =>
                setFormDetails({ ...formDetails, email: text })
              }
              keyboardType="email-address"
              style={styles.input}
              placeholder="Enter your email"
            />
            <Text style={styles.errorText}>{formatedErrors?.email}</Text>
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
              defaultCode={orgSettings?.country_code ?? 'NG'}
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
                width: wp(300),
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
                color: theme.SimpuBlack,
                // backgroundColor: 'red',
              }}
              textInputStyle={{
                margin: 0,
                fontSize: fs(16),
                padding: 0,
                color: theme.SimpuBlack,
              }}
              // layout="first"
              textContainerStyle={{
                // height: 40,
                padding: 0,

                backgroundColor: 'transparent',
              }}
            />
            <Text style={styles.errorText}>{formatedErrors?.phone}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.lable}>Message</Text>
            <TextInput
              value={formDetails?.message}
              textAlignVertical="top"
              onChangeText={(text) =>
                setFormDetails({ ...formDetails, message: text })
              }
              multiline
              style={[styles.input, { height: hp(90) }]}
              placeholder="write your message"
              placeholderTextColor={theme.SimpuGray}
            />
            <Text style={styles.errorText}>{formatedErrors?.message}</Text>
          </View>

          <TouchableOpacity
            disabled={isLoading}
            style={[styles.sendBtn, {}]}
            onPress={SendMessage}
          >
            {!isLoading ? (
              <Text style={styles.sendBtnTxt}>Send message</Text>
            ) : (
              <ActivityIndicator color={theme.SimpuWhite} />
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>

  );
};

export default ContactForm;
