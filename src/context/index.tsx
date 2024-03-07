import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useState,
} from 'react';
import type { OrgSettingType } from '../@types/types';

type ChatContextType = {
  AppId: string;
  publicKey: string;
  orgSettings: OrgSettingType;
  openChatBot: boolean;
  viewIndex: number;
  setApp_id: React.Dispatch<React.SetStateAction<string>>;
  setPublic_key: React.Dispatch<React.SetStateAction<string>>;
  setOrgSettings: React.Dispatch<React.SetStateAction<OrgSettingType | null>>;
  setOpenChatBot: React.Dispatch<React.SetStateAction<boolean>>;
  setViewIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const useChatProvider = () => {
  const context = useContext(ChatContext) as ChatContextType;
  // console.log('context', viewIndex, setOpenChatBot);
  if (!context) throw new Error('you need to use a chat provider');
  return context;
};

// type ProviderProps = {
//   children: ReactNode;
// };

const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [orgSettings, setOrgSettings] = useState<OrgSettingType | null>(null);
  const [AppId, setApp_id] = useState('');
  const [publicKey, setPublic_key] = useState('');
  const [openChatBot, setOpenChatBot] = useState(false);
  const [viewIndex, setViewIndex] = useState(1);

  const values = {
    AppId,
    publicKey,
    orgSettings,
    openChatBot,
    viewIndex,
    setApp_id,
    setViewIndex,
    setOrgSettings,
    setOpenChatBot,
    setPublic_key,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
