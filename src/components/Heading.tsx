import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { fs, hp, wp } from '../utils/config';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { Platform } from 'react-native';

const Heading = ({
  handleCloseLiveChat,
}: {
  handleCloseLiveChat: () => void;
}) => {
  const { orgSettings } = useChatProvider();

  return (
    <View
      style={{
        paddingHorizontal: wp(25),
        paddingTop:Platform.OS==='android' ? hp(5): hp(20), //TODO:adjust this
        backgroundColor: orgSettings?.style.background_color ?? theme.SimpuBlue,
        height: hp(220),
      }}
    >
      <Image
        style={{ height: hp(60), width: hp(60) }}
        source={{ uri: orgSettings?.style?.header_logo }}
      />
      <Text
        style={{
          fontSize: fs(24),
          lineHeight: 24,
          color: theme.SimpuWhite,
        }}
      >
        {orgSettings?.welcome_message?.greeting}
      </Text>
      <Text
        style={{
          fontSize: fs(16),
          lineHeight: 24,
          color: theme.SimpuWhite,
          paddingVertical: hp(5),
        }}
      >
        {orgSettings?.welcome_message?.team_intro}
      </Text>
      <Text
        style={{
          fontSize: fs(16),
          lineHeight: 24,
          color: theme.SimpuWhite,
        }}
      >
        {/* We reply instantly from {orgSettings?.officeHrs} */}
      </Text>

      <TouchableOpacity
        onPress={handleCloseLiveChat}
        style={{ position: 'absolute', top:Platform.OS==='android' ?hp(60): hp(80), right: wp(30) }}
      >
        <Image
          style={{ height: hp(18), width: hp(20) }}
          source={require('../assets/closeIcon.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Heading;
