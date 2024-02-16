import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {deviceHeight} from '../utils/responsiveConfig';
import {theme} from '../utils/theme';
import PhoneInput from 'react-native-phone-number-input';
import {useChatProvider} from '../context';

const ContactForm = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const {setViewIndex, orgSettings} = useChatProvider();

  const styles = StyleSheet.create({
    container: {
      height: deviceHeight * 0.65,
      marginTop: -deviceHeight * 0.05,
      marginHorizontal: 20,
      backgroundColor: theme.SimpuWhite,
      borderRadius: 10,
      padding: 10,
    },

    inputContainer: {
      marginVertical: 8,
      marginHorizontal: 15,
    },
    lable: {
      fontSize: 16,
      paddingVertical: 5,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: orgSettings.brandColor ?? theme.SimpuBlue,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    sendBtn: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: orgSettings.brandColor ?? theme.SimpuBlue,
      marginHorizontal: 15,
      marginVertical: 15,
      borderRadius: 10,
    },
    sendBtnTxt: {
      color: theme.SimpuWhite,
      fontSize: 16,
      fontWeight: '600',
    },
  });
  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 15}}>
        <Text style={{paddingVertical: 10, fontSize: 16, fontWeight: '500'}}>
          We'll like to know you!
        </Text>
      </View>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Name</Text>
          <TextInput style={styles.input} placeholder="Enter your name" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.lable}>Email</Text>
          <TextInput
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
            onChangeText={text => {
              setValue(text);
            }}
            onChangeFormattedText={text => {
              setFormattedValue(text);
            }}
            withDarkTheme={false}
            // withShadow
            autoFocus
            containerStyle={{
              borderWidth: 1,
              width: 300,
              borderColor: orgSettings.brandColor ?? theme.SimpuBlue,
              borderRadius: 8,
              backgroundColor: 'transparent',
              // marginHorizontal: ,
              // height: 40,
            }}
            codeTextStyle={{
              fontSize: 16,
              padding: 0,
              margin: 0,
            }}
            textInputStyle={{
              margin: 0,
              fontSize: 16,
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
            multiline
            style={[styles.input, {height: 80}]}
            placeholder="write your message"
          />
        </View>

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => setViewIndex(3)}>
          <Text style={styles.sendBtnTxt}>Send message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContactForm;
