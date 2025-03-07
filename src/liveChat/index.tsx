import { View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Start from './Start';
import { theme } from '../utils/theme';
import Footer from '../components/Footer';
import { useChatProvider } from '../context';
import ContactForm from './ContactForm';
import type { LiveChatProps } from '../@types/types';
import {
  addOrUpdateUser,
  getUserHash,
  useSettingsQuery,
  useWidgetAppsQuery,
} from '../utils';
import { getCache, KEYS, storeCache, storeCompanyConfig } from '../utils/cache';
import Heading from '../components/Heading';
import { usePusherWebsocket } from '../Hooks/pusherSocket';
import Chat from './chat';
import { pusherInstance } from '../index'

const LiveChatContainer = (Props: LiveChatProps) => {
  const { name, email, app_id, user_id, public_key } = Props;

  const { userId,viewIndex,handleCloseLiveChat,setOrgSettings, setApp_id, setPublic_key, setWidgetApps,setUserHash,setUserId } =
    useChatProvider();
  const { pusherInit } = usePusherWebsocket();

  const { data, error, isLoading } = useSettingsQuery({
    app_id,
    public_key,
  });

  const { data: apps } = useWidgetAppsQuery({
    app_id,
    public_key,
  });

  // console.log({ app_id, public_key });

  // console.log('data from settings', JSON.stringify(data, null, 3));
  // console.log(
  //   'error from settuseSettingsQueryings',
  //   JSON.stringify(error, null, 3)
  // );

  const handleSaveUserId = useCallback(async () => {
    //generate user hash
    const user_hash = getUserHash({
      public_key,
      user_id: user_id?.toString() ?? '',
      secret_key: data?.secret_key!,
    });

    // console.log('Users -hash =========', user_hash);

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


      if (pusherInstance?.connectionState !== 'CONNECTED') {   
        pusherInit({ app_id, user_hash, user_id: user_id ?? '' });
      }


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
    storeCompanyConfig(data);
    return () => {};
  }, [data]);

  useEffect(() => {
    // saveState({ ...(loadState() ?? {}), public_key });
    if (user_id && data) {
      handleSaveUserId();
    }
  }, [data, user_id, public_key, handleSaveUserId]);



  useEffect(() => {
    (async () => {
      const signed_request = await getCache(KEYS.SIGNED_REQUEST);
      const user_id = await getCache(KEYS.USER_ID);

      if (signed_request) {
        setUserHash(signed_request);
      }

      if(user_id){
        setUserId(user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (apps) {
      setWidgetApps(apps?.apps);
    }
  }, [apps]);

  return (
    <View
      style={{
        // flex: 1,
        // height: SCREEN_HEIGHT,
        // width: SCREEN_WIDTH,
        backgroundColor: theme.SimpuPaleWhite,

        //styling to place livechat above all views
        position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom:0,
    // padding: 10,
    // alignItems: "center",
    zIndex: 9999, // Ensure it's always on top
    elevation: 9999, // For Android
        
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
