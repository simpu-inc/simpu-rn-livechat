import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { SCREEN_HEIGHT, fs } from '../utils/config';

const Footer = () => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    footerContainer: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: SCREEN_HEIGHT * 0.015,
    },
    footerText: {
      textAlign: 'center',
      fontSize: fs(14),
    },
  });
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
