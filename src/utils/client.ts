// import { loadState } from ".";
// import { pusher } from "./pusher";
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { KEYS, getCache } from './cache';

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
    signed_request,
    method = 'GET',
    headers: customHeaders,
    ...customConfig
  }: AxiosRequestConfig = {},
  tokenProtected = true
) {
  // const { signed_request } = loadState() ?? {};
  // const signed_request = await getCache(KEYS.SIGNED_REQUEST);

  // console.log('User signed_request inside client', signed_request);

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
    params: {
      ...customConfig,
    },
  };

  try {
    const result = await Axios(config);
    const { data } = result;
    return data;
  } catch (error) {
    throw error;
  }
}

const axiosRequestInterceptor = Axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // console.log(
    //   `###########  All Outgoing API  Request ######\n`,
    //   JSON.stringify(config, null, 2)
    // );
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
const axiosResponseInterceptor = Axios.interceptors.response.use(
  function (response: AxiosResponse) {
    // console.log('Error occurred===', response);
    return response;
  },
  function (error: AxiosError) {
    console.log('Error occurred===', JSON.stringify(error, null, 3));
    if (error.response && error.response.data) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 410)
      ) {
        //Unauthorized error, navigate back to the login screen
        // ForceUserLogOut();
      }
      //@ts-ignore
      if (error.response.data.conversationErrorPayload) {
        return Promise.reject(error.response.data);
      }
      //@ts-ignore
      return Promise.reject(error.response.data.message);
    }
    return Promise.reject(error.message);
  }
);
