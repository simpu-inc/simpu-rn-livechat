import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '../utils/theme';
import {deviceHeight} from '../utils/responsiveConfig';
import {useChatProvider} from '../context';

const Footer = () => {
  const {orgSettings} = useChatProvider();
  const styles = StyleSheet.create({
    footerContainer: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: deviceHeight * 0.035,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 16,
    },
  });
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        <Text style={{color: theme.SimpuBlack}}>Powered by </Text>
        <Text style={{color: orgSettings.brandColor ?? theme.SimpuBlue}}>
          Simpu
        </Text>
      </Text>
    </View>
  );
};

export default Footer;
