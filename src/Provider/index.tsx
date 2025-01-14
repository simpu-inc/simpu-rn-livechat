
import { APIClient } from "simpu-api-sdk";
// import {  pusher, useWidget ,loadState} from "../utils";

// const CONVERSATION_API_URL = "https://conversation.v1.simpu.co/chat";
const CONVERSATION_API_URL = "https://conversation.v1.simpu.sh/chat";

// const AI_API_URL = "https://ai.simpu.co/";
const AI_API_URL = "https://ai.simpu.sh/";

export const apiClient = new APIClient({
  graph: "",
  events: "",
  "knowledge-base": "",
  ai: AI_API_URL ?? "",
  apps: "",
  core: "",
  report: "",
  payment: "",
  notification: "",
  "apps-action": "",
  inbox: CONVERSATION_API_URL ?? "",
});

apiClient.instance.interceptors.response.use(
    //@ts-ignore
    function (response) {
      // console.log(
      //   "PAYLOAD from AXIOS RESPONSE  ==>",
      //   JSON.stringify(response, null, 3)
      // );
      return response;
    },
    function (error) {
      // console.log("ERRROR from AXIOS RESPONSE  ==>",JSON.stringify(error,null,3))
  
      if (
        error?.response &&
        (error?.response.status === 401 || error?.response.status === 410)
      ) {
        // signOut({ callbackUrl: '/login' });
      }
      if (error?.response && error?.response.data) {
        if (
          error.response.data.conversationErrorPayload ||
          error.response.data?.["error_payload"]
        ) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.response.data.message);
      }
      return Promise.reject(error.message);
    }
  );
  
  apiClient.instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      // console.log(
      //   "PAYLOAD from AXIOS RESQUEST CONFIG ==>",
      //   JSON.stringify(config, null, 3)
      // );
      return config;
    },
    
    function (error) {
      // Do something with request error
      // console.log("ERRROR from AXIOS REQUEST CONFIG ==>",JSON.stringify(error,null,3))
      return Promise.reject(error);
    }
  );