import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';
import type { OrgSettingType } from '../@types/types';

type ChatContextType = {
  AppId: string;
  publicKey: string;
  sessionID: string;
  orgSettings: OrgSettingType;
  openChatBot: boolean;
  viewIndex: number;
  userHash: string;
  setUserHash: React.Dispatch<React.SetStateAction<string>>;
  setApp_id: React.Dispatch<React.SetStateAction<string>>;
  setSessionID: React.Dispatch<React.SetStateAction<string>>;
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

const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [orgSettings, setOrgSettings] = useState<OrgSettingType | null>(null);
  const [AppId, setApp_id] = useState('');
  const [publicKey, setPublic_key] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [openChatBot, setOpenChatBot] = useState(false);
  const [viewIndex, setViewIndex] = useState(1);
  const [userHash, setUserHash] = useState('');
  // const [onlineAgents, setOnlineAgents] = useState([]);
  // const [userTypingData, setUserTypingData] = useState();

  const values = useMemo(
    () => ({
      AppId,
      publicKey,
      orgSettings,
      openChatBot,
      viewIndex,
      sessionID,
      userHash,
      setApp_id,
      setViewIndex,
      setOrgSettings,
      setOpenChatBot,
      setPublic_key,
      setSessionID,
      setUserHash,
    }),
    [
      AppId,
      publicKey,
      orgSettings,
      openChatBot,
      viewIndex,
      sessionID,
      setApp_id,
      setViewIndex,
      setOrgSettings,
      setOpenChatBot,
      setPublic_key,
      setSessionID,
    ]
  );

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
