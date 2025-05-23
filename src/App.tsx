import React, { forwardRef } from 'react';
import  { useChatProvider } from './context';
import LiveChatContainer from './liveChat';
import type { LiveChatProps } from './@types/types';

const App = forwardRef((props: LiveChatProps,ref) => {

  const {openLiveChat,closeLiveChat,openChatBot}  = useChatProvider();

  

    // This must use useCallback to ensure the ref doesn't get set to null and then a new ref every render.
    React.useImperativeHandle(
      ref,
      React.useCallback(
        () => ({
          openLiveChat,
          closeLiveChat
        }),
        [openLiveChat, closeLiveChat]
      )
    );


    if (!openChatBot) {
      return null;
      
    }
  return (

      <LiveChatContainer {...props} />

  );
});

export default App;
