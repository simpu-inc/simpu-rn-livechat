import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { fs, hp, wp } from '../utils/config';
import { Linking } from 'react-native';


const SocialBtn = ({ title, url }: { title: string; url: string }) => {
  const { orgSettings } = useChatProvider();

  const styles = StyleSheet.create({
    btn: {
      height: hp(44),
      backgroundColor: theme.SimpuWhite,
      marginVertical: hp(10),
      marginHorizontal: wp(15),
      borderRadius: hp(10),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
    },
    btnIcon: {
      height: hp(20),
      width: hp(20),
      paddingRight: wp(7),
    },
    btnTxt: {
      color: theme.SimpuBlack,
      fontSize: fs(14),
      fontWeight: '600',
      paddingLeft: wp(7),
      textTransform: 'capitalize',
    },
  });

  const Icon = (title: string) => {
    switch (title) {
      case 'Twitter':
        return (
          <Image
            style={styles.btnIcon}
            source={require('../assets/twitter.png')}
          />
        );
      case 'Instagram':
        return (
          <Image
            style={styles.btnIcon}
            source={require('../assets/instagram.png')}
          />
        );
      case 'Messenger':
        return (
          <Image
            style={styles.btnIcon}
            source={require('../assets/messenger.png')}
          />
        );
      case 'whatsapp':
        return (
          <Image
            style={styles.btnIcon}
            source={require('../assets/whatsapp.png')}
          />
        );

      default:
        return '';
    }
  };

  const openLink = () => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={openLink}>
      {Icon(title)}
      <Text style={styles.btnTxt}>{title}</Text>
    </TouchableOpacity>
  );
};

const SocialCard = () => {
  const { apps } = useChatProvider();

  return (
    <View>
      {apps?.map((app, index) => (
        <SocialBtn key={index} title={app?.type} url={app.url} />
      ))}
    </View>
  );
};

export default SocialCard;
