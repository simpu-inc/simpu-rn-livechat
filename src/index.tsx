import React from 'react';
import type { LiveChatProps } from './@types/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const MAX_RETRIES = 3;
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

  // console.log('Prps  LiveChat index===', Props);
  return (
    <QueryClientProvider client={queryClient}>
      <App {...Props} />
    </QueryClientProvider>
  );
};

export default SimpuLiveChat;
