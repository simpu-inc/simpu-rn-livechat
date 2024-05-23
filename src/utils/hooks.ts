import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { getUnreadMessageCount, getWidgetApps, loadState, useWidget } from '.';
// import { saveState } from "./localstorage";
// import { pusher, subscribeToPresenceChannel } from './pusher';
import {
  getBotOperatorCredentials,
  getConversationMessages,
  getCustomBotPath,
  getCustomBotRootPath,
  getSessionById,
  getUserActiveSession,
  getWidgetSettings,
  uploadConversationFile,
} from './service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCache, KEYS } from './cache';

export const useSettingsQuery = ({
  app_id,
  public_key,
}: {
  app_id: string;
  public_key: string;
}) =>
  useQuery({
    queryKey: ['widget-settings', app_id],
    queryFn: () => getWidgetSettings({ app_id, public_key }),
  });

export const useSessionQuery = (
  { app_id, session_id }: { app_id: string; session_id: string },
  options: Object
) =>
  useQuery({
    queryKey: ['session', session_id],
    queryFn: () => getSessionById(app_id, session_id),
    ...options,
  });

export const useWidgetAppsQuery = ({ app_id, public_key }) => {
  return useQuery(['widget-apps', app_id], () =>
    getWidgetApps({ app_id, public_key })
  );
};

export const useNotificationsQuery = ({ app_id }) => {
  const { signed_request } = loadState() ?? {};

  return useQuery('notifications', () => getUnreadMessageCount({ app_id }), {
    enabled: !!signed_request && !!app_id,
  });
};

export const useActiveSessionQuery = ({ app_id }, options) =>
  useQuery('user-active-session', () => getUserActiveSession(app_id), options);

// export const useCustomBotRootPath = (custom_bot_id, options) =>
//   useQuery(
//     ['custom-bot-root-path', custom_bot_id],
//     () => getCustomBotRootPath(custom_bot_id),
//     options
//   );

// export const useCustomBotPath = (path_id, options) =>
//   useQuery(
//     ['custom-bot-path', path_id],
//     () => getCustomBotPath(path_id),
//     options
//   );

// export const useBotOperatorCredential = (credential_id, options) => {
//   const { data } = useQuery(
//     ['bot-operator-credential', credential_id],
//     () => getBotOperatorCredentials(credential_id),
//     options
//   );

//   // saveState({ ...loadState(), ...data?.bots });
//   return data;
// };

export const useCloudinary = ({
  file,
  app_id,
  onUploaded,
}: {
  file: any;
  app_id: string;
  onUploaded: () => {};
}) => {
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState();
  const [Uploading, setUploading] = useState(false);

  const handleUploadProgress = (progressEvent) => {
    const percentage = parseInt(
      Math.round((progressEvent?.loaded * 100) / progressEvent?.total)
    );
    setProgress(percentage);
  };

  const handleUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('files', file);
      const signed_request = await getCache(KEYS.SIGNED_REQUEST);
      try {
        setUploading(true);
        const response = await uploadConversationFile(
          app_id,
          signed_request,
          formData,
          handleUploadProgress
        );

        console.log('RESPONSE FROM UPLOAD', JSON.stringify(response, null, 3));
        setResponse(response);

        onUploaded?.(response);

        return response;
      } catch (error) {
        console.log('ERROR FROM UPLOAD', JSON.stringify(error, null, 3));
      } finally {
        setUploading(false);
      }
    }
  };

  // useQuery(['file-upload', file.name], () => handleUpload(file), {
  //   enabled: !!file.name,
  //   refetchOnWindowFocus: false,
  // });

  useQuery({
    queryKey: ['file-upload', file.name],
    queryFn: () => handleUpload(file),
    enabled: !!file.name,
    refetchOnMount: false,
  });

  return { progress, response, Uploading };
};

export const useReactQuerySubscription = ({ app_id }) => {
  const queryClient = useQueryClient();
  const {
    handlePlayPopSound,
    setUserTypingData,
    handleAddOnlineAgent,
    handleRemoveOnlineAgent,
  } = useWidget();

  const { user_id, uuid } = loadState() ?? {};

  useEffect(() => {
    let clearTimerId;
    const clearInterval = 900;

    // if (!(user_id && pusher)) {
    //   return;
    // }

    const messageCallback = async (payload) => {
      await Promise.all(
        ['messages', 'conversations', 'notifications'].map((filter) =>
          queryClient.invalidateQueries(filter)
        )
      );

      if (!!payload.author_id) {
        handlePlayPopSound();
      }
    };

    // const subscribeToThreadActivities = async () => {
    //   const { privateChannel, presenceChannel } =
    //     await subscribeToPresenceChannel(app_id);
    //   privateChannel.bind('message_new', messageCallback);
    //   privateChannel.bind('message_retry', messageCallback);
    //   privateChannel.bind('thread_assigned', messageCallback);
    //   privateChannel.bind('thread_resolved', (thread) => {
    //     queryClient.invalidateQueries('conversations');
    //   });
    //   privateChannel.bind(
    //     'user_typing',
    //     ({ typer_id, thread_id, user_type, typer_info }) => {
    //       setUserTypingData({ user_type, thread_id, typer_id, typer_info });
    //       clearTimeout(clearTimerId);
    //       clearTimerId = setTimeout(() => {
    //         setUserTypingData(undefined);
    //       }, clearInterval);
    //     }
    //   );
    //   presenceChannel.bind('pusher:member_added', (member) => {
    //     handleAddOnlineAgent(member.id);
    //   });
    //   presenceChannel.bind('pusher:member_removed', (member) => {
    //     handleRemoveOnlineAgent(member.id);
    //   });
    // };

    // if (pusher) {
    //   subscribeToThreadActivities();
    // }
  }, [user_id, app_id, uuid]);
};

export function useControllableProp(propValue, stateValue) {
  const { current: isControlled } = useRef(propValue !== undefined);
  const value = isControlled ? propValue : stateValue;
  return [isControlled, value];
}

export function useArray({
  max,
  array,
  onChange,
  defaultValue,
  keepWithinMax,
}) {
  const [data, setData] = useState(defaultValue || []);
  const [isControlled, value] = useControllableProp(array, data);

  const isAtMax = Boolean(max && value.length === max);
  const isOutOfRange = Boolean(max && value.length > max);

  const updateState = useCallback(
    (nextState) => {
      if (max && nextState.length > max && keepWithinMax) {
        return;
      }
      if (!isControlled) setData(nextState);
      if (onChange) onChange(nextState);
    },
    [isControlled, max, onChange, keepWithinMax]
  );

  const add = useCallback(
    (item) => {
      updateState([...value, item]);
    },
    [value, updateState]
  );

  const addMultiple = useCallback(
    (item) => {
      updateState([...value, ...item]);
    },
    [value, updateState]
  );

  const update = useCallback(
    (item, index) => {
      const newData = [...value];
      newData[index] = item;
      updateState([...newData]);
    },
    [value, updateState]
  );

  const remove = useCallback(
    (index) => {
      const newData = value.filter((x, idx) => index !== idx);
      updateState(newData);
    },
    [value, updateState]
  );

  const reorder = useCallback(
    (oldIndex, newIndex) => {
      const newData = arrayMove(value, oldIndex, newIndex);
      updateState(newData);
    },
    [value, updateState]
  );

  return {
    data: value,
    isAtMax,
    isOutOfRange,
    add,
    reorder,
    update,
    remove,
    addMultiple,
  };
}

export const useBusinessHoursCheck = (business_hours) => {
  if (!business_hours) {
    return {
      isAvailable: false,
      nextAvailableDay: 'Monday',
    };
  }

  const { schedules } = business_hours ?? {};

  const dayRegister = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  const day = new Date().getDay().toString();
  const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;

  const milliseconds = (time) => {
    const [h, m] = time.split(':');

    return (h * 60 * 60 + m * 60) * 1000;
  };

  const businessDays = Object.keys(schedules).filter(
    (key) => !!schedules[key].is_active
  );

  const isBusinessDay = businessDays.includes(day);

  const isWithinBusinessHours = useMemo(() => {
    if (isBusinessDay) {
      const { from, to } = schedules[day];
      return (
        milliseconds(currentTime) >= milliseconds(from) &&
        milliseconds(currentTime) <= milliseconds(to)
      );
    }
    return false;
  }, [isBusinessDay, schedules, currentTime]);

  const isAvailable = isBusinessDay && isWithinBusinessHours;

  const nextAvailableDay = useMemo(() => {
    if (isBusinessDay) {
      const days = Object.keys(schedules);
      const t = days.findIndex((item) => item === day);

      return dayRegister[days[t]];
    } else {
      const lastBusinessDay = businessDays[businessDays.length - 1];

      if (Number(lastBusinessDay) > Number(day)) {
        return dayRegister[lastBusinessDay];
      } else {
        return dayRegister[businessDays[0]];
      }
    }
  }, []);

  return { isAvailable, nextAvailableDay };
};
