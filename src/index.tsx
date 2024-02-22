import React from 'react';
import ChatProvider from './context';
import type { LiveChatProps } from './@types/types';
import LiveChatContainer from './LiveChatContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const MAX_RETRIES = 2;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const SimpuLiveChat = (Props: LiveChatProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (failureCount > MAX_RETRIES) {
            return false;
          }

          if (
            error?.isAxiosError &&
            HTTP_STATUS_TO_NOT_RETRY.includes(error?.response?.status ?? 0)
          ) {
            return false;
          }

          return true;
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <LiveChatContainer {...Props} />
      </ChatProvider>
    </QueryClientProvider>
  );
};

export default SimpuLiveChat;
