import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Start from './Start';
import { theme } from '../utils/theme';
import Footer from '../components/Footer';
import Chat from './Chat';
import { useChatProvider } from '../context';
import ContactForm from './ContactForm';
import type { LiveChatProps } from '../@types/types';
import { addOrUpdateUser, getUserHash, useSettingsQuery } from '../utils';
import { SCREEN_HEIGHT, SCREEN_WIDTH, fs, hp, wp } from '../utils/config';
import { KEYS, storeCache } from '../utils/cache';
import Heading from '../components/Heading';
import { usePusherWebsocket } from '../Hooks/pusherSocket';

const LiveChatContainer = (Props: LiveChatProps) => {
  const { name, email, app_id, user_id, public_key, setOpenliveChat } = Props;

  const { viewIndex, setOrgSettings, setApp_id, setPublic_key } =
    useChatProvider();
  const { pusherInit } = usePusherWebsocket();

  console.log('Prps  LiveChat container===', Props);

  const { data, error, isLoading } = useSettingsQuery({
    app_id,
    public_key,
  });

  console.log({ app_id, public_key });

  console.log('data from settings', JSON.stringify(data, null, 3));
  console.log(
    'error from settuseSettingsQueryings',
    JSON.stringify(error, null, 3)
  );

  const handleSaveUserId = useCallback(async () => {
    //generate user hash
    const user_hash = getUserHash({
      public_key,
      user_id: user_id?.toString() ?? '',
      secret_key: data?.secret_key,
    });

    console.log('Users -hash =========', user_hash);

    try {
      //@ts-ignore
      const { uuid, user_id: userId } = await addOrUpdateUser({
        data: {
          name: name ?? '',
          email: email ?? '',
        },
        app_id,
        signed_request: user_hash,
      });

      // initializePusher({ app_id, user_hash, user_id });
      await storeCache(KEYS.UUID, uuid);
      await storeCache(KEYS.SIGNED_REQUEST, user_hash);
      await storeCache(KEYS.USER_ID, userId);
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

  const handleCloseLiveChat = () => {
    Alert.alert(
      'Close LiveChat',
      'you are about to close the live chat window',
      [
        {
          text: 'Stay',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'default',
        },
        {
          text: 'Close',
          onPress: () => setOpenliveChat((prev) => !prev),
          // style: 'cancel',
        },
      ]
    );
  };

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
        <Heading handleCloseLiveChat={handleCloseLiveChat} />
      )}
      {viewIndex === 1 && <Start />}
      {viewIndex === 2 && <ContactForm />}
      {viewIndex === 3 && <Chat />}
      {(viewIndex === 1 || viewIndex === 2) && <Footer />}
    </View>
  );
};

export default LiveChatContainer;
