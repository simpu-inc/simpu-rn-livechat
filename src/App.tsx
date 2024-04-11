import React from 'react';
import ChatProvider from './context';
import LiveChatContainer from './liveChat';
import type { LiveChatProps } from './@types/types';

const App = (Props: LiveChatProps) => {
  return (
    <ChatProvider>
      <LiveChatContainer {...Props} />
    </ChatProvider>
  );
};

export default App;
