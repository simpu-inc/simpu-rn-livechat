import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ChatProvider from './context';
import ChatBotContainer from './ChatBotContainer';

type chatBotProps = {
  openLiveChat:boolean
};

const SimpuLiveChat = (Props: chatBotProps) => {

  const {openLiveChat} = Props

  if(openLiveChat) return 
  return (
    <ChatProvider>
      <ChatBotContainer {...Props} />
    </ChatProvider>
  );
};

export default SimpuLiveChat;
