import React, {
  ReactNode,
  FC,
  createContext,
  useContext,
  useState,
} from 'react';
import type { OrgSettingType } from '../@types/types';

type ChatContextType = {
  orgSettings: OrgSettingType;
  openChatBot: boolean;
  viewIndex: number;
  setOrgSettings: React.Dispatch<React.SetStateAction<OrgSettingType | null>>;
  setOpenChatBot: React.Dispatch<React.SetStateAction<boolean>>;
  setViewIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const useChatProvider = () => {
  const context = useContext(ChatContext) as ChatContextType;
  // console.log('context', viewIndex, setOpenChatBot);
  // if (!context) throw new Error('you need to use a chat provider');
  return context;
};

// type ProviderProps = {
//   children: ReactNode;
// };

const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [orgSettings, setOrgSettings] = useState<OrgSettingType | null>(null);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [viewIndex, setViewIndex] = useState(1);
  return (
    <ChatContext.Provider
      value={{
        orgSettings,
        openChatBot,
        viewIndex,
        setOrgSettings,
        setOpenChatBot,
        setViewIndex,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
