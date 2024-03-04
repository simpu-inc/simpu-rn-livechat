import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { fs, hp, wp } from '../utils/config';

type SocialsProps = {};

const SocialBtn = ({ title, url }: { title: string; url: string }) => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    btn: {
      height: hp(44),
      backgroundColor: theme.SimpuWhite,
      marginVertical: hp(10),
      marginHorizontal: wp(5),
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
