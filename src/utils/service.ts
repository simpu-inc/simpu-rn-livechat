import { buildAIUrl } from ".";
import { client } from "./client";

export async function getWidgetSettings({ app_id, public_key }) {
  const response = await client(`channels/livechat/${app_id}/settings`, {
    headers: {
      Authorization: public_key,
    },
  });
  return response.data;
}

export async function addOrUpdateUser({ data, app_id, signed_request }) {
  const response = await client(`channels/livechat/${app_id}/users`, {
    data,
    method: "POST",
    headers: {
      Authorization: signed_request,
    },
  });
  return response.data;
}

export async function sendMessage(data, app_id) {
  const response = await client(`channels/livechat/${app_id}/messages`, {
    data,
    method: "POST",
  });
  return response.data.message;
}

export async function getConversationMessages(params) {
  const { session_id, app_id, ...rest } = params;

  const response = await client(
    `channels/livechat/${app_id}/messages/${session_id}`,
    {
      params: rest,
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
    method: "POST",
  });

  return data;
};

export const updateConversationMessage = async (payload) => {
  const { message_id, app_id, ...rest } = payload;

  const { data } = await client(
    `channels/livechat/${app_id}/messages/${message_id}/notification`,
    {
      data: rest,
      method: "PATCH",
    }
  );

  return data;
};

export const uploadConversationFile = async (
  app_id,
  payload,
  onUploadProgress
) => {
  const { data } = await client(`channels/livechat/${app_id}/upload`, {
    data: payload,
    method: "POST",
    onUploadProgress,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.upload_ids;
};

export const getWebsocketChannel = async (app_id) => {
  const { data } = await client(`channels/livechat/${app_id}/websocket`);

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
  const { data } = await client("", {
    url: buildAIUrl(`bot_operators/credentials/${credential_id}`),
  });

  return data;
};

export const getCustomBotRootPath = async (custom_bot_id) => {
  const { data } = await client("", {
    url: buildAIUrl(`custom_bots/${custom_bot_id}/root`),
  });

  return data;
};

export const getCustomBotPath = async (path_id) => {
  const { data } = await client("", {
    url: buildAIUrl(`custom_bots/paths/${path_id}`),
  });

  return data;
};

export const importMessages = async (app_id, payload) => {
  const { data } = await client(`channels/livechat/${app_id}/messages/import`, {
    method: "POST",
    data: payload,
  });

  return data;
};

export const saveCSATRating = async (payload, id) => {
  const { data } = await client("", {
    method: "POST",
    data: payload,
    url: buildAIUrl(`inbox_ratings/rate/${id}}`),
  });

  return data;
};
