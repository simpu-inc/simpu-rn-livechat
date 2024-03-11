import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { formatName } from '../utils/helper';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { Image } from 'react-native';
import { fs, hp } from '../utils/config';

type AvatarPopsTypes = {
  name: string;
  imgUrl?: string;
  orgColor?: string;
  index: number;
  agentLength: number;
  size?: 'small' | 'big';
};

const Avatar = ({
  name,
  index,
  imgUrl,
  agentLength,
  size,
}: AvatarPopsTypes) => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: size === 'small' ? hp(40) : hp(50),
      width: size === 'small' ? hp(40) : hp(50),
      borderRadius: size === 'small' ? hp(20) : hp(50),
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      borderWidth: 1,
      borderColor: theme.SimpuWhite,
      zIndex: agentLength - index,
      marginRight: size === 'small' ? -hp(18) : -hp(16),
    },

    avatarText: {
      color: theme.SimpuWhite,
      fontSize: fs(16),
    },
  });

  if (!!imgUrl) {
    return <Image style={styles.avatarContainer} source={{ uri: imgUrl }} />;
  }
  return (
    <View style={[styles.avatarContainer, {}]}>
      <Text style={styles.avatarText}>{formatName(name)}</Text>
    </View>
  );
};

export default Avatar;
