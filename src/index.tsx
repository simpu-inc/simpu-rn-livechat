import React from 'react';
import ChatProvider from './context';
import type { LiveChatProps } from './@types/types';
import LiveChatContainer from './LiveChatContainer';

const SimpuLiveChat = (Props: LiveChatProps) => {
  return (
    <ChatProvider>
      <LiveChatContainer {...Props} />
    </ChatProvider>
  );
};

export default SimpuLiveChat;
