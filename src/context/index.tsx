import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import type { OrgSettingType } from '../@types/types';
import { getCompanyConfig } from '../utils/cache';
import type { LivechatWidgetApp, LivechatWidgetApps } from 'simpu-api-sdk';

type ChatContextType = {
  AppId: string;
  apps: LivechatWidgetApp[]
  publicKey: string;
  sessionID: string;
  orgSettings: OrgSettingType;
  openChatBot: boolean;
  viewIndex: number;
  userHash: string;
  userId: string;
  setWidgetApps: React.Dispatch<React.SetStateAction<LivechatWidgetApp[]>>
  setUserHash: React.Dispatch<React.SetStateAction<string>>;
  setApp_id: React.Dispatch<React.SetStateAction<string>>;
  setSessionID: React.Dispatch<React.SetStateAction<string>>;
  setPublic_key: React.Dispatch<React.SetStateAction<string>>;
  setOrgSettings: React.Dispatch<React.SetStateAction<OrgSettingType | null>>;
  setOpenChatBot: React.Dispatch<React.SetStateAction<boolean>>;
  setViewIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserId: React.Dispatch<React.SetStateAction<string>>
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
  const [apps, setWidgetApps] = useState<LivechatWidgetApp[]>([]);
  const [publicKey, setPublic_key] = useState('');
  const [sessionID, setSessionID] = useState('');
  const [openChatBot, setOpenChatBot] = useState(false);
  const [viewIndex, setViewIndex] = useState(1);
  const [userHash, setUserHash] = useState('');
  const [userId, setUserId] = useState('')

  const getOrgSettingsLocalStorage = async () => {
    const config = await getCompanyConfig();
    setOrgSettings(config);
  };

  useEffect(() => {
    getOrgSettingsLocalStorage();

    // return () => {

    // }
  }, []);

  const values = useMemo(
    () => ({
      AppId,
      apps,
      publicKey,
      orgSettings,
      openChatBot,
      viewIndex,
      sessionID,
      userHash,
      userId,
      setApp_id,
      setViewIndex,
      setOrgSettings,
      setOpenChatBot,
      setPublic_key,
      setSessionID,
      setUserHash,
      setWidgetApps,
      setUserId
    }),
    [
      AppId,
      apps,
      setWidgetApps,
      publicKey,
      orgSettings,
      openChatBot,
      viewIndex,
      userId,
      sessionID,
      setApp_id,
      setViewIndex,
      setOrgSettings,
      setOpenChatBot,
      setPublic_key,
      setSessionID,
      setUserHash,
    ]
  );

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
