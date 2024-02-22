import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect } from 'react';

import Start from './views/Start';
import { deviceHeight, deviceWidth } from './utils/responsiveConfig';
import { theme } from './utils/theme';
import Footer from './components/Footer';
import Chat from './views/Chat';
import { useChatProvider } from './context';
import ContactForm from './views/ContactForm';
import type { LiveChatProps } from './@types/types';
import { useSettingsQuery } from './utils';

const LiveChatContainer = (Props: LiveChatProps) => {
  const { name, email, app_id, user_id, public_key } = Props;

  const {
    openChatBot,
    orgSettings,
    viewIndex,
    setOpenChatBot,
    setOrgSettings,
  } = useChatProvider();

  const { data, error, isLoading } = useSettingsQuery({
    app_id,
    public_key,
  });

  console.log('data from settings', JSON.stringify(data, null, 3));

  useEffect(() => {
    setOrgSettings(data);
    return () => {};
  }, [data]);

  return (
    <View
      style={{
        flex: 1,
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: theme.SimpuPaleWhite,
      }}
    >
      {(viewIndex === 1 || viewIndex === 2) && (
        <View
          style={{
            paddingHorizontal: 25,
            paddingTop: 50, //TODO:adjust this
            backgroundColor:
              orgSettings?.style.background_color ?? theme.SimpuBlue,
            height: deviceHeight * 0.3,
          }}
        >
          <Image
            style={{ height: 60, width: 60 }}
            source={{ uri: orgSettings?.style?.header_logo }}
          />
          <Text
            style={{
              fontSize: 26,
              lineHeight: 24,
              color: theme.SimpuWhite,
            }}
          >
            {orgSettings?.welcome_message?.greeting}
          </Text>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 24,
              color: theme.SimpuWhite,
              paddingVertical: 5,
            }}
          >
            {orgSettings?.welcome_message?.team_intro}
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: theme.SimpuWhite,
            }}
          >
            {/* We reply instantly from {orgSettings?.officeHrs} */}
          </Text>
        </View>
      )}
      {viewIndex === 1 && <Start />}
      {viewIndex === 2 && <ContactForm />}

      {viewIndex === 3 && <Chat />}

      {(viewIndex === 1 || viewIndex === 2) && <Footer />}
    </View>
  );
};

export default LiveChatContainer;
