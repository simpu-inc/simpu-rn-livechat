import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { SCREEN_HEIGHT, fs } from '../utils/config';
import { Platform } from 'react-native';

const Footer = () => {
  const { orgSettings } = useChatProvider();
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const styles = StyleSheet.create({
    footerContainer: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom:Platform.OS==='android' ? SCREEN_HEIGHT * 0.010 :SCREEN_HEIGHT * 0.025,
    },
    footerText: {
      textAlign: 'center',
      fontSize: fs(14),
    },
  });


  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);



  if (keyboardStatus ==='Keyboard Shown'  ) {
    return null;
    
  }

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        <Text style={{ color: theme.SimpuBlack }}>Powered by </Text>
        <Text
          style={{
            color: orgSettings?.style?.background_color ?? theme.SimpuBlue,
          }}
        >
          Simpu
        </Text>
      </Text>
    </View>
  );
};

export default Footer;
