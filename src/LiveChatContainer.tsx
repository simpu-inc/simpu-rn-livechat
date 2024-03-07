import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useContext, useEffect } from 'react';

import Start from './views/Start';
import { theme } from './utils/theme';
import Footer from './components/Footer';
import Chat from './views/Chat';
import { useChatProvider } from './context';
import ContactForm from './views/ContactForm';
import type { LiveChatProps } from './@types/types';
import { addOrUpdateUser, getUserHash, useSettingsQuery } from './utils';
import { SCREEN_HEIGHT, SCREEN_WIDTH, fs, hp, wp } from './utils/config';

const LiveChatContainer = (Props: LiveChatProps) => {
  const { name, email, app_id, user_id, public_key } = Props;

  const {
    openChatBot,
    orgSettings,
    viewIndex,
    setOpenChatBot,
    setOrgSettings,
    setApp_id,
    setPublic_key,
  } = useChatProvider();

  const { data, error, isLoading } = useSettingsQuery({
    app_id,
    public_key,
  });

  console.log({ app_id, public_key });

  console.log('data from settings', JSON.stringify(data, null, 3));
  console.log('error from settings', JSON.stringify(error, null, 3));

  const handleSaveUserId = useCallback(async () => {
    //generate user hash
    const user_hash = getUserHash({
      public_key,
      user_id: user_id?.toString() ?? '',
      secret_key: data?.secret_key,
    });

    console.log('Users -hash =========', user_hash);

    try {
      const { uuid, user_id: userId } = await addOrUpdateUser({
        data: {
          name,
          email,
        },
        app_id,
        signed_request: user_hash,
      });

      // initializePusher({ app_id, user_hash, user_id });
      // saveState({
      //   ...(loadState() ?? {}),
      //   uuid,
      //   user_id: userId,
      //   signed_request: user_hash,
      // });
    } catch (error) {}
  }, [name, email, app_id, user_id, data?.secret_key]);

  useEffect(() => {
    setApp_id(app_id);
    setPublic_key(public_key);
    return () => {};
  }, [app_id, public_key]);

  useEffect(() => {
    setOrgSettings(data);
    return () => {};
  }, [data]);

  useEffect(() => {
    // saveState({ ...(loadState() ?? {}), public_key });
    if (user_id && data) {
      handleSaveUserId();
    }
  }, [data, user_id, public_key, handleSaveUserId]);

  return (
    <View
      style={{
        flex: 1,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        backgroundColor: theme.SimpuPaleWhite,
      }}
    >
      {(viewIndex === 1 || viewIndex === 2) && (
        <View
          style={{
            paddingHorizontal: wp(25),
            paddingTop: hp(20), //TODO:adjust this
            backgroundColor:
              orgSettings?.style.background_color ?? theme.SimpuBlue,
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
