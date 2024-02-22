import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { formatName } from '../utils/helper';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { Image } from 'react-native';

type AvatarPopsTypes = {
  name: string;
  imgUrl?: string;
  orgColor?: string;
  index: number;
  agentLength: number;
};

const Avatar = ({ name, index, imgUrl, agentLength }: AvatarPopsTypes) => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      borderWidth: 1,
      borderColor: theme.SimpuWhite,
      zIndex: agentLength - index,
      marginRight: -14,
    },

    avatarText: {
      color: theme.SimpuWhite,
      fontSize: 18,
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
