import React from 'react';
import type {
  ChatActionRef,
  LiveChatOpenParams,
  LiveChatProps,
  LiveCloseParams,
} from './@types/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { Pusher } from '@pusher/pusher-websocket-react-native';
import ChatProvider from './context';

const MAX_RETRIES = 3;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

//pusher instance
export const pusherInstance = Pusher.getInstance();

type LiveChatRefObj = {
  current: ChatActionRef | null;
};

let refs: LiveChatRefObj[] = [];

/**
 * Adds a ref to the end of the array, which will be used to show the LiveChat until its ref becomes null.
 *
 * @param newRef the new ref, which must be stable for the life of the LiveChat instance.
 */
function addNewRef(newRef: ChatActionRef) {
  refs.push({
    current: newRef,
  });
}

/**
 * Removes the passed in ref from the file-level refs array using a strict equality check.
 *
 * @param oldRef the exact ref object to remove from the refs array.
 */
function removeOldRef(oldRef: ChatActionRef | null) {
  refs = refs.filter((r) => r.current !== oldRef);
}

export const SimpuLiveChat = (Props: LiveChatProps) => {
  const LiveChatRef = React.useRef<ChatActionRef | null>(null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (failureCount > MAX_RETRIES) {
            return false;
          }


          if (
            //@ts-ignore
            error?.isAxiosError &&
            //@ts-ignore
            HTTP_STATUS_TO_NOT_RETRY.includes(error?.response?.status ?? 0)
          ) {
            return false;
          }

          return true;
        },
      },
    },
  });

  const setRef = React.useCallback((ref: ChatActionRef | null) => {
    // Since we know there's a ref, we'll update `refs` to use it.
    if (ref) {
      // store the ref in this liveChat instance to be able to remove it from the array later when the ref becomes null.
      LiveChatRef.current = ref;
      addNewRef(ref);
    } else {
      // remove the this liveChat's ref, wherever it is in the array.
      removeOldRef(LiveChatRef.current);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <App {...Props} ref={setRef} />
      </ChatProvider>
    </QueryClientProvider>
  );
};

function getRef() {
  const reversePriority = [...refs].reverse();
  const activeRef = reversePriority.find((ref) => ref?.current !== null);
  if (!activeRef) {
    return null;
  }
  return activeRef.current;
}

SimpuLiveChat.open = (params?: LiveChatOpenParams) => {
  getRef()?.openLiveChat(params);
};

SimpuLiveChat.close = (params?: LiveCloseParams) => {
  getRef()?.closeLiveChat(params);
};

export default SimpuLiveChat;
