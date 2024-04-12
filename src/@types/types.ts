import type { SetStateAction } from 'react';
import { types } from 'react-native-document-picker';
//@ts-ignore
import { CountryCode } from 'react-native-country-picker-modal';
export type LiveChatProps = {
  app_id: string;
  name?: string;
  email?: string;
  phone?: string;
  public_key: string;
  user_id?: string;
  image_url?: string;
  setOpenliveChat: React.Dispatch<SetStateAction<boolean>>;
};

export type welcomeType = {
  greeting: string;
  language: string;
  team_intro: string;
};

export type StyleType = {
  position: string;
  action_color: string;
  side_spacing: number;
  bottom_spacing: number;
  custom_launcher: string;
  background_color: string;
  header_logo: any;
};

export type AgentType = {
  name: string;
  uuid: string;
  user_id: string;
  image_url: any;
};

export type scheduleType = {
  to: string;
  from: string;
  is_active: boolean;
};

type Schedules = {
  '0': scheduleType;
  '1': scheduleType;
  '2': scheduleType;
  '3': scheduleType;
  '4': scheduleType;
  '5': scheduleType;
  '6': scheduleType;
};

type Businesshours = {
  schedules: Schedules;
};

export type OrgSettingType = {
  id: string;
  name: string;
  secret_key: string;
  platform_id: string;
  apps: any;
  style: StyleType;
  launcher_text: string;
  response_time: number;
  integration_id: string;
  show_watermark: boolean;
  welcome_message: welcomeType;
  show_business_hours: boolean;
  members: AgentType[];
  timezone: string;
  business_hours: Businesshours;
  country_code?: CountryCode;
};

export const acceptedFileTypes = [
  types.images,
  types.audio,
  types.video,
  types.doc,
  types.docx,
  types.pdf,
  types.xls,
  types.ppt,
  types.xlsx,
];

export type UserTyingType = {
  typer_id: string;
  thread_id: string;
  user_type: 'user' | 'customer';
  message_type: 'message' | 'comment';
  typer_info: { name: string; id: string; image_url?: string | null };
};

export type messageType = {
  type: string;
  author: AuthorType;
  entity: EntityType;
  id: number;
  uuid: string;
  account_id: string;
  by_account: any;
  show_in_thread: any;
  created_datetime: string;
  updated_datetime: any;
  author_id: string;
  author_type: string;
  content_id: string;
  content_type: string;
};

export type AuthorType = {
  contacts: any;
  contact: ContactType;
  meta: MetaType;
  image_url: any;
  platform_id: string;
  channel_name: string;
  name: string;
  id: number;
  platform_name: any;
  platform_nick: string;
  uuid: string;
  channel_id: string;
  is_valid: boolean;
};

export type ContactType = {
  name: string;
  phone: string;
  account_id: string;
};

export type MetaType = {
  phone: string;
};

export type EntityType = {
  content: ContentType;
  id: number;
  pid: string;
  uuid: string;
  meta: any;
  status: string;
  quoted_id: any;
  author_id: string;
  attachments: any;
  mention_ids: any;
  recipient_ids: any;
};

export type ContentType = {
  body: string;
};
