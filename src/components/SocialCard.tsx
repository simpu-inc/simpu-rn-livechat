import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {theme} from '../utils/theme';
import {useChatProvider} from '../context';

type SocialsProps = {};

const SocialBtn = ({title, url}: {title: string; url: string}) => {
  const {orgSettings} = useChatProvider();
  const styles = StyleSheet.create({
    btn: {
      height: 40,
      backgroundColor: theme.SimpuWhite,
      marginVertical: 10,
      marginHorizontal: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: orgSettings.brandColor ?? theme.SimpuBlue,
    },
    btnIcon: {
      height: 20,
      width: 20,
      paddingRight: 7,
    },
    btnTxt: {
      color: theme.SimpuBlack,
      fontSize: 16,
      fontWeight: '600',
      paddingLeft: 7,
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
      case 'WhatsApp':
        return (
          <Image
            style={styles.btnIcon}
            source={require('../assets/whatsapp.png')}
          />
        );

      default:
        break;
    }
  };
  return (
    <TouchableOpacity style={styles.btn}>
      {Icon(title)}
      <Text style={styles.btnTxt}>{title}</Text>
    </TouchableOpacity>
  );
};

const SocialCard = ({}: SocialsProps) => {
  const styles = StyleSheet.create({});
  return (
    <View>
      <SocialBtn title={'Twitter'} url={''} />
      <SocialBtn title={'Instagram'} url={''} />
      <SocialBtn title={'Messenger'} url={''} />
      <SocialBtn title={'WhatsApp'} url={''} />
    </View>
  );
};

export default SocialCard;
