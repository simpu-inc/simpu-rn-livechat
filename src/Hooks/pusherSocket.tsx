import {
  PusherChannel,
  PusherEvent
} from '@pusher/pusher-websocket-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { pusherInstance } from '..';
import type { UserTyingType } from '../@types/types';
import { useChatProvider } from '../context';
import apiClient from '../Provider';
import { buildConversationUrl } from '../utils';
import { getCache, KEYS } from '../utils/cache';

const PUSHER_APP_CLUSTER = 'eu';
const PUSHER_APP_KEY_DEMO = '37a83ec66a78f2436be5';

const EventType = {
  MESSAGE_NEW: 'message_new',
  MESSAGE_RETRY: 'message_retry',
  MESSAGE_UPDATE: 'message_update',
  USER_TYPING: 'user_typing',
};

const play_notification_sound = '';
const profile = '';

export const usePusherWebsocket = () => {
  const queryClient = useQueryClient();
  const {  AppId, userHash } = useChatProvider();

  let clearTypingTimerId: ReturnType<typeof setTimeout>;

  function onConnectionStateChange(
    currentState: string,
    previousState: string
  ) {
    console.log(
      `${Platform.OS} onConnectionStateChange. previousState=${previousState} newState=${currentState}`
    );
  }

  function onError(message: string, code: Number, error: any) {
    console.error(error);
    console.log(`onError: ${message} code: ${code} exception: ${error}`);
  }

  async function onEvent(event: PusherEvent) {
    const data = await JSON.parse(event?.data);
    console.log('listening to event', event);

    console.log(
      'listening to event from pusher init event',
      JSON.stringify(data, null, 2)
    );
  }

  function onSubscriptionSucceeded(channelName: string, data: any) {
    console.log(
      ` ${
        Platform.OS
      } onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(
        data,
        null,
        2
      )}`
    );

    const channel = pusherInstance.getChannel(channelName) as PusherChannel;
    // const me = channel?.me;
  }

  function onSubscriptionError(channelName: string, message: string, e: any) {
    console.log('subscription error', e);
    console.log(
      ` ${
        Platform.OS
      } onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(
        message,
        null,
        2
      )}`
    );
  }

  const pusherInit = async ({
    app_id,
    user_hash,
    // user_id,
  }: {
    app_id: string;
    user_hash: string;
    user_id: string;
  }) => {
    // console.log('Pusher was initiated !!');

    if (!(app_id && user_hash)) return;

    console.log('COPY APP_ID: ====' + app_id);
    console.log('COPY USER_HASH: ====' + user_hash);

    await pusherInstance.init({
      //     apiKey: ENVIROMENT ? PUSHER_APP_KEY_DEMO : PUSHER_APP_KEY_PRODUCTION,
      apiKey: PUSHER_APP_KEY_DEMO,
      cluster: PUSHER_APP_CLUSTER,
      authEndpoint: buildConversationUrl(
        `accounts/${app_id}/websocket/mobile?token=ssr__${user_hash}`
      ),

      onConnectionStateChange,
      onError,
      onEvent,
      onSubscriptionSucceeded,
      onSubscriptionError,
    });

    await pusherInstance.connect();
    await subscribeTochannels();
  };



  //events bindings
  const handleMessageEvent = useCallback(
    async (Event: PusherEvent) => {
      const { data} = Event;
      const eventData = await JSON.parse(data);
      const  thread_ids = eventData?.thread_ids;
      // const author_id = eventData?.author_id;
    

      const messagesQueryKey = thread_ids.map((t:any) => ['conversations', t]);

      await Promise.all(
        ['messages','filters-unread-count', 'threads',...messagesQueryKey].map(
          filter => queryClient.invalidateQueries({queryKey:[filter]}),
        ),
      ).finally(() => {
        // if (author_id !== profile?.id) {
        //   play_notification_sound &&
        //     AppState.currentState === 'active' &&
        //     notificicationSound?.play();
        // }
      });
    },
    [play_notification_sound, pusherInstance, profile]
  );

  // const handleUserTypingEvent = async (Event: PusherEvent) => {
  //   const { data, eventName } = Event;
  //   const eventData: UserTyingType = await JSON.parse(data);
  //   // console.log('Typing event', JSON.stringify(eventData, null, 2));
  //   // dispatch(showTyper(eventData));
  //   // clearTimeout(clearTypingTimerId);
  //   // clearTypingTimerId = setTimeout(() => {
  //   //   // dispatch(removeTyper());
  //   // }, 1500);
  // };

  const EventHandler = (event: PusherEvent) => {
    const eventName = event?.eventName;
    switch (eventName) {
      case EventType.MESSAGE_NEW:
        handleMessageEvent(event);
        break;
      // case EventType.USER_TYPING:
      //   handleUserTypingEvent(event);
      //   break;
      default:
        break;
    }
  };

  //channel names

  const subscribeHandler = async (
    channelName: string,
    eventHandler: (event: PusherEvent) => void
  ) => {
    // console.log("pusherInstamnce  ==>",pusherInstance)

    const channel1 = await pusherInstance?.subscribe({
      channelName,
      onEvent: eventHandler,
    });
  };


  //call all subscribe  channels
  const subscribeTochannels = async () => {
    // const user_hash = await getCache(KEYS.SIGNED_REQUEST);

    try {
      const [privateChannelName, presenceChannelName] =
        (await apiClient.inbox.livechat.getWebsocketChannel(AppId, {
          headers: {
            Authorization: userHash ? `ssr__${userHash}` : undefined,
          },
        }));

      // const socketId = await pusherInstance?.getSocketId()

      // console.log("full pusher instance socket~ID",socketId)
      // console.log('private channel===>', privateChannelName);
      // console.log('presence channel===>', presenceChannelName);

      const user_id = await getCache(KEYS.USER_ID);
      const privateChanel = `private-${user_id}`;

      await subscribeHandler(privateChanel, EventHandler);
      await subscribeHandler(privateChannelName, EventHandler);
      await subscribeHandler(presenceChannelName, EventHandler);
    } catch (error) {
      console.log('error from Subscription try/catch', error);
    }
  };

  const disconnectPuserConnection = async () => {
    if (pusherInstance.connectionState !== 'CONNECTED') return;
    await pusherInstance.disconnect();
  };

  //  console.log("full pusher instance",pusherInstance)
  return {
    pusherInit,
    subscribeTochannels,
    disconnectPuserConnection,
  };
};
