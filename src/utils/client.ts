// import { loadState } from ".";
// import { pusher } from "./pusher";
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// const CONVERSATION_API_URL = "https://conversation.simpu.co/api/v1";
const CONVERSATION_API_URL = 'https://conversation.simpu.sh/api/v1';

// const AI_API_URL = "https://ai.simpu.co/";
const AI_API_URL = 'https://ai.simpu.sh/';

export const buildConversationUrl = (url: string) =>
  `${CONVERSATION_API_URL}/${url}`;
export const buildAIUrl = (url: string) => `${AI_API_URL}/${url}`;

export async function client(
  url: string,
  {
    data,
    method = 'GET',
    headers: customHeaders,
    ...customConfig
  }: AxiosRequestConfig = {},
  tokenProtected = true
) {
  // const { signed_request } = loadState() ?? {};
  const signed_request = '';

  const headers = {
    'Authorization': signed_request ? signed_request : undefined,
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  // if (pusher?.connection?.socket_id) {
  //   headers['Simpu_Socket_ID'] = pusher.connection.socket_id;
  // }
  const config = {
    headers,
    method,
    data,
    url: buildConversationUrl(url),
    ...customConfig,
  };

  try {
    const result = await Axios(config);
    const { data } = result;
    return data;
  } catch (error) {
    throw error;
  }
}
