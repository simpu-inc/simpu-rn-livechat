import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { buildConversationUrl,  getWebsocketChannel } from '../utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getCache, KEYS } from '../utils/cache';
import { useChatProvider } from '../context';
import type { UserTyingType } from '../@types/types';
import { Platform } from 'react-native';
import { pusherInstance } from 'simpu-rn-livechat';
import apiClient from '../Provider';

const PUSHER_APP_CLUSTER = 'eu';
const PUSHER_APP_KEY_DEMO = '37a83ec66a78f2436be5';


const EventType = {
  MESSAGE_NEW: 'message_new',
  USER_TYPING: 'user_typing',
};


const play_notification_sound = '';
const profile = '';


export const usePusherWebsocket = () => {
  const queryClient = useQueryClient();
  const { viewIndex, AppId,userHash } = useChatProvider();

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
    console.log(`onError: ${message} code: ${code} exception: ${error}`);
  }

  async function onEvent(event: PusherEvent) {
    const data = await JSON.parse(event?.data);
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

    //@ts-ignore
    const channel: PusherChannel = pusher.getChannel(channelName);
    const me = channel.me;
  }

  const pusherInit = async ({
    app_id,
    user_hash,
    user_id,
  }: {
    app_id: string;
    user_hash: string;
    user_id: string;
  }) => {
    // console.log('Pusher was initiated !!');

    if (!(app_id && user_hash)) return;

    // console.log('COPY APP_ID: ====' + app_id);
    // console.log('COPY USER_HASH: ====' + user_hash);

    await pusherInstance.init({
      //     apiKey: ENVIROMENT ? PUSHER_APP_KEY_DEMO : PUSHER_APP_KEY_PRODUCTION,
      apiKey: PUSHER_APP_KEY_DEMO,
      cluster: PUSHER_APP_CLUSTER,
      authEndpoint: buildConversationUrl(
        `/accounts/${app_id}/websocket/mobile?token=${user_hash}`
      // authEndpoint: buildConversationUrl(
      //   `channels/livechat/${app_id}/websocket2?token=${user_hash}`
      ),

      onConnectionStateChange,
      onError,
      onEvent,
      onSubscriptionSucceeded,
    });

    await pusherInstance.connect();
    // await subscribeTochannels();
  };

  // console.log(
  //   '------ Notification sound outSide callback is enabled !!!!',
  //   play_notification_sound,
  // );

  //events bindings
  const handleMessageEvent = useCallback(
    async (Event: PusherEvent) => {
      const { eventName, data, channelName } = Event;
      const eventData = await JSON.parse(data);
      const { author_id, thread_id } = eventData?.messages[0];

      // await Promise.all(
      //   ['filters-unread-count', ['conversations', thread_id], 'threads'].map(
      //     (filter) => queryClient.invalidateQueries(filter)
      //   )
      // ).finally(() => {
      //   if (author_id !== profile?.id) {
      //     play_notification_sound &&
      //       AppState.currentState === 'active' &&
      //       notificicationSound?.play();
      //   }
      // });
    },
    [play_notification_sound, pusherInstance, profile]
  );

  const handleUserTypingEvent = async (Event: PusherEvent) => {
    const { data, eventName } = Event;
    const eventData: UserTyingType = await JSON.parse(data);
    // console.log('Typing event', JSON.stringify(eventData, null, 2));
    // dispatch(showTyper(eventData));
    clearTimeout(clearTypingTimerId);
    clearTypingTimerId = setTimeout(() => {
      // dispatch(removeTyper());
    }, 1500);
  };

  const EventHandler = (event: PusherEvent) => {
    const eventName = event?.eventName;

    // console.log('Event name from event handler===', eventName);

    switch (eventName) {
      case EventType.MESSAGE_NEW:
        handleMessageEvent(event);
        break;
      case EventType.USER_TYPING:
        handleUserTypingEvent(event);
        break;
      default:
        break;
    }
  };

  //channel names

  const subscribeHandler = async (
    channelName: string,
    eventHandler: (event: PusherEvent) => void
  ) => {

    const channel1 = await pusherInstance?.subscribe({
      channelName,
      onEvent: eventHandler,
    });



    // console.log("subscription response ===>",channel1)
  };

  //call all subscribe  channels
  const subscribeTochannels = async () => {
    // const user_hash = await getCache(KEYS.SIGNED_REQUEST);



    const [privateChannelName, presenceChannelName] = (await apiClient.inbox.livechat.getWebsocketChannel(AppId,{
      headers:{
        Authorization:userHash ? `ssr__${userHash}` : undefined
      }
    }));
  


    const socketId = await pusherInstance?.getSocketId()

    // console.log("full pusher instance socket~ID",socketId)
    // console.log('private channel===>', privateChannelName);
    // console.log('presence channel===>', presenceChannelName);

    const user_id = await getCache(KEYS.USER_ID);
    const privateChanel = `private-${user_id}`;

    try {
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
