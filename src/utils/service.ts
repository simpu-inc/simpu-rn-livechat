import apiClient from '../Provider';
import { buildAIUrl, client } from './client';

const perPageFetch = 20;

export async function getWidgetSettings({
  app_id,
  public_key,
}: {
  app_id: string;
  public_key: string;
}) {
  const response = await client(`channels/livechat/${app_id}/settings`, {
    headers: {
      Authorization: public_key,
    },
  });
  return response.data;
}

export const fetchThreadMessages = ({
  pageParam = 1,
  app_id,
  session_id,
  user_hash,
}: {
  pageParam: number;
  app_id: string;
  session_id: string;
  user_hash: string;
}) => {
  return getConversationMessages({
    app_id,
    page: pageParam,
    session_id: session_id ?? '',
    signed_request: user_hash,
  });
};

export async function addOrUpdateUser({
  data,
  app_id,
  signed_request,
}: {
  data: {
    name: string;
    email: string;
    phone?: string;
  };
  app_id: string;
  signed_request: string;
}) {

 const response = await apiClient.inbox.livechat.addUpdateUser(app_id,data,{
    headers:{
      Authorization: `ssr__${signed_request}`
    }
  });

  return response;
}

export async function sendMessage(
  message:{body:string},
  app_id: string,
  signed_request?: string
) {
 const response = await apiClient.inbox.livechat.sendMessage(app_id,message,{
    headers:{
      Authorization: `ssr__${signed_request}`
    }
  })


  return response.message;
}

export async function getConversationMessages(params) {
  const { session_id, page, app_id, signed_request, ...rest } = params;

  // console.log(
  //   'SIgned request insed to get conversation messages',
  //   signed_request
  // );

  let query = {
    page,
    per_page: perPageFetch,
  };
  const response = await client(
    `channels/livechat/${app_id}/messages/${session_id}`,
    {
      signed_request: signed_request,
      ...query,
      ...rest,
    }
  );
  return response.data;
}

export async function getUserConversations(params) {
  const { app_id, ...rest } = params;

  const response = await client(`channels/livechat/${app_id}/sessions`, {
    params: rest,
  });
  return response.data;
}

export async function getUnreadMessageCount(params) {
  const { app_id, ...rest } = params;

  const response = await client(`channels/livechat/${app_id}/unreadCount/`, {
    params: rest,
  });
  return response.data?.count;
}

export async function getWidgetApps({ app_id, public_key }) {
  const response = await client(`channels/livechat/${app_id}/apps`, {
    headers: { Authorization: public_key },
  });
  return response.data;
}

export const sendTypingEvent = async ({ app_id }) => {
  const { data } = await client(`channels/livechat/${app_id}/typing`, {
    method: 'POST',
  });

  return data;
};

export const updateConversationMessage = async (payload) => {
  const { message_id, app_id, ...rest } = payload;

  const { data } = await client(
    `channels/livechat/${app_id}/messages/${message_id}/notification`,
    {
      data: rest,
      method: 'PATCH',
    }
  );

  return data;
};

export const uploadConversationFile = async (
  app_id: string,
  signed_request: string,
  payload: any,
  onUploadProgress: any
) => {
  const { data } = await client(`channels/livechat/${app_id}/upload`, {
    data: payload,
    method: 'POST',
    onUploadProgress,
    signed_request: signed_request,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': signed_request,
    },
  });

  return data.upload_ids;
};

export const getWebsocketChannel = async (
  app_id: string,
  signed_request: string
) => {
  const { data } = await client(`channels/livechat/${app_id}/websocket`, {
    headers: {
      Authorization: signed_request,
    },
    signed_request: signed_request,
  });

  return data.channels;
};

export const getSessionById = async (app_id, session_id) => {
  const { data } = await client(
    `channels/livechat/${app_id}/sessions/${session_id}`
  );

  return data;
};

export const getUserActiveSession = async (app_id) => {
  const { data } = await client(`channels/livechat/${app_id}/sessions/active`);

  return data;
};

export const getBotOperatorCredentials = async (credential_id) => {
  const { data } = await client('', {
    url: buildAIUrl(`bot_operators/credentials/${credential_id}`),
  });

  return data;
};

export const getCustomBotRootPath = async (custom_bot_id) => {
  const { data } = await client('', {
    url: buildAIUrl(`custom_bots/${custom_bot_id}/root`),
  });

  return data;
};

export const getCustomBotPath = async (path_id) => {
  const { data } = await client('', {
    url: buildAIUrl(`custom_bots/paths/${path_id}`),
  });

  return data;
};

export const importMessages = async (app_id, payload) => {
  const { data } = await client(`channels/livechat/${app_id}/messages/import`, {
    method: 'POST',
    data: payload,
  });

  return data;
};

export const saveCSATRating = async (payload, id) => {
  const { data } = await client('', {
    method: 'POST',
    data: payload,
    url: buildAIUrl(`inbox_ratings/rate/${id}}`),
  });

  return data;
};
