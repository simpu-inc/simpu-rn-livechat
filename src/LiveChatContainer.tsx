import { Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect } from 'react';

import Start from './views/Start';
import { deviceHeight } from './utils/responsiveConfig';
import { theme } from './utils/theme';
import Footer from './components/Footer';
import Chat from './views/Chat';
import { useChatProvider } from './context';
import ContactForm from './views/ContactForm';
import type { LiveChatProps } from './@types/types';

const LiveChatContainer = (Props: LiveChatProps) => {
  const {
    openChatBot,
    orgSettings,
    viewIndex,
    setOpenChatBot,
    setOrgSettings,
  } = useChatProvider();

  useEffect(() => {
    setOrgSettings({
      name: 'Waka Waka',
      brandColor: '#FD6A02', //6C22A6 FF004D B80000
      welcomeMessage: 'At Waka Waka we plan a memorable Trip',
      officeHrs: '8am-5pm Work days',
    });

    return () => {};
  }, []);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.SimpuPaleWhite }}>
        {(viewIndex === 1 || viewIndex === 2) && (
          <View
            style={{
              paddingHorizontal: 25,
              paddingTop: 100, //TODO:adjust this
              backgroundColor: orgSettings?.brandColor ?? theme.SimpuBlue,
              height: deviceHeight * 0.3,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                lineHeight: 24,
                color: theme.SimpuWhite,
              }}
            >
              Welcome 👋
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: theme.SimpuWhite,
                paddingVertical: 5,
              }}
            >
              {orgSettings?.welcomeMessage}
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: theme.SimpuWhite,
              }}
            >
              We reply instantly from {orgSettings?.officeHrs}
            </Text>
          </View>
        )}
        {viewIndex === 1 && <Start />}
        {viewIndex === 2 && <ContactForm />}

        {viewIndex === 3 && <Chat />}

        {(viewIndex === 1 || viewIndex === 2) && <Footer />}
      </View>
    </>
  );
};

export default LiveChatContainer;
