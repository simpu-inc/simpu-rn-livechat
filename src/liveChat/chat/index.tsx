import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import groupBy from 'lodash/groupBy';
import { format } from 'date-fns';
import DocumentPicker from 'react-native-document-picker';
import {
  fetchThreadMessages,
  generateNewMessage,
  generateUUID,
  getConversationMessages,
  responseTimeRegister,
  sendMessage,
  useSessionQuery,
} from '../../utils';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { acceptedFileTypes } from '../../@types/types';
import Attachment from '../../components/Attachment';
import AgentsCard from '../../components/AgentsCard';
import ChatInput from './ChatInput';
import { fs, hp, SCREEN_HEIGHT, SCREEN_WIDTH, wp } from '../../utils/config';
import { theme } from '../../utils/theme';
import { useChatProvider } from '../../context';
import ChatItem from './chatItem';
import { usePusherWebsocket } from '../../Hooks/pusherSocket';

const Chat = () => {
  const queryClient = useQueryClient();
  const { AppId, userHash, sessionID, setViewIndex, orgSettings } =
    useChatProvider();

  const { subscribeTochannels } = usePusherWebsocket();

  const [message, setMessage] = useState('');

  const [attachements, setAttachements] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState();

  const { mutate: mutateSendMessage } = useMutation({
    mutationFn: (payload) => {
      return sendMessage(payload, AppId, userHash);
    },
    onMutate: async (data) => {
      const { attachments, user_id, content } = data;

      const newMessage = generateNewMessage({
        attachments,
        user_id,
        content,
      });

      // console.log(
      //   '===new Generated message ===',
      //   JSON.stringify(newMessage, null, 3)
      // );

      await queryClient.cancelQueries({
        queryKey: ['messages', sessionID],
        exact: true,
      });

      const previousMessages = queryClient.getQueryData([
        'messages',
        sessionID,
      ]);

      queryClient.setQueryData(['messages', sessionID], (old) => ({
        ...old,
        pages: old?.pages?.map((page) => {
          if (page.meta.page === 1) {
            return {
              ...page,
              messages: [newMessage, ...page.messages],
            };
          }
          return page;
        }),
      }));

      // setText("");
      // setAttachments();
      setUploadedFiles([]);

      setMessage('');

      return { previousMessages };
    },
    onError: (error) => {
      // toast({
      //   position: "top",
      //   render: ({ onClose }) => (
      //     <ToastBox
      //       onClose={onClose}
      //       message={
      //         typeof error === "string"
      //           ? error
      //           : error?.message ?? "Error! Failed to send message"
      //       }
      //     />
      //   ),
      // });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', data.session_id],
        exact: true,
      });
      // history.push(`/chat/${data.session_id}`);
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  // console.log('userHassh inside chat...', userHash);

  const { data: session } = useSessionQuery(
    {
      app_id: AppId,
      session_id: sessionID,
    },
    { enabled: !!sessionID, initialData: orgSettings?.members }
  );

  // console.log('Session from use session', JSON.stringify(session, null, 3));

  const {
    data: threadMessages,
    isLoading: isFetchingThreadMessges,
    hasNextPage: threadMessagesHasNextPage,
    fetchNextPage: threadMessagesFetchNextPage,
    refetch: threadMessagesRefetch,
  } = useInfiniteQuery({
    queryKey: ['messages', sessionID],
    queryFn: ({ pageParam }) =>
      fetchThreadMessages({
        pageParam,
        app_id: AppId,
        session_id: sessionID,
        user_hash: userHash,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // console.log(
      //   'nextPage from inifinite query',
      //   JSON.stringify(lastPage, null, 3)
      // );
      return lastPage.meta.page < lastPage.meta.page_count
        ? lastPage.meta.page + 1
        : undefined;
    },
    enabled: !!sessionID,
  });

  const messages =
    threadMessages?.pages?.reduce(
      (acc, page) => [...acc, ...page.messages],
      []
    ) ?? [];

  // const groupedMessages = groupBy(messages, (message) =>
  //   format(new Date(message.created_datetime), 'MMM dd, yyyy')
  // );

  // console.log('=====Thread message:===', JSON.stringify(threadMessages, null, 3));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.12,
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: hp(15),
      paddingTop: hp(28),
    },

    imageStyle: {
      height: hp(40),
      width: hp(40),
      borderRadius: hp(25),
      borderWidth: 1.3,
      borderColor: theme.SimpuWhite,
    },
    NameText: {
      color: theme.SimpuPaleWhite,
      fontSize: fs(18),
      fontWeight: '600',
    },
    responseTimeText: {
      color: theme.SimpuPaleWhite,
      fontSize: fs(14),
    },
  });

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: acceptedFileTypes,
      });
      const file = {
        uri: res[0]?.uri,
        type: res[0]?.type,
        name: res[0]?.name,
        size: res[0]?.size,
        id: generateUUID(),
      };
      const isFileTooLarge = file?.size !== null && file?.size >= 10271520;

      if (isFileTooLarge) return;

      // console.log('FILE====', JSON.stringify(file, null, 3));

      setAttachements((prev) => [...prev, file]);
      // if (isFileTooLarge) {
      //   Toast.show({
      //     type: ToastTypes.WARNING,
      //     text1: 'File too large',
      //     text2: 'Maximum file size allowed is 10 Mb',
      //   });
      //   return;
      // }
      // setAttachmentDetails([file, ...attachmentDetails]);
      // const newFileData = new FormData();
      // newFileData.append('files', file);
      // newFileData.append('type', messageType);
      // mutate({
      //   file: newFileData,
      //   Auth: token,
      //   organisationId: organisation?.id,
      //   credentialId,
      // });
    } catch (error) {
      // crashlytics().log(`${error}`);
      console.log('Error from  picker', error);
    }
  };

  const handleSendMessage = () => {
    // console.log('message from input=====', message);
    if (userHash) {
      mutateSendMessage({
        user_id: AppId,
        content: message,
        attachment_ids: uploadedFiles,
      });
    } else {
      // clearState();
      // setHomeSectionStep(1);
      // history.push('/home');
    }
  };

  const handleCloseLiveChat = () => {
    Alert.alert(
      'Close LiveChat',
      'you are about to close the live chat window',
      [
        {
          text: 'Stay',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'default',
        },
        {
          text: 'Close',
          onPress: () => console.log('OK Pressed'),
          // style: 'cancel',
        },
      ]
    );
  };

  const handleFileUploadCompleted = (file) => {
    setUploadedFiles((prevUploadedFiles) => {
      if (!!prevUploadedFiles && !!prevUploadedFiles?.length) {
        return prevUploadedFiles.concat(file);
      }
      return file;
    });
  };

  const handleDeleteUploadedFile = (id: string) => {
    console.log('@ file id ===', id);
    // setUploadedFiles((prevUploadedFiles) =>
    //   prevUploadedFiles.filter((item, index) => item?.id !== id)
    // );

    setAttachements((prevAttachments) =>
      prevAttachments.filter((item, index) => item?.id !== id)
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setViewIndex(1)}
            >
              <Image
                source={require('../../assets/backIcon.png')}
                style={{ height: hp(18), width: hp(18) }}
              />
              {/* <Image
                 resizeMode="contain"
                 style={styles.imageStyle}
                 source={{ uri: `https://i.pravatar.cc/150?img=${3}` }}
               /> */}
              <AgentsCard size="small" />
            </TouchableOpacity>
            <View style={{ marginLeft: hp(15) }}>
              <Text style={styles.NameText}>{orgSettings?.name}</Text>
              <Text style={styles.responseTimeText}>
                {orgSettings?.response_time
                  ? `Typically replies ${
                      responseTimeRegister[orgSettings?.response_time]
                    }`
                  : orgSettings?.welcome_message?.team_intro}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            // onPress={handleCloseLiveChat}
            onPress={subscribeTochannels}
            // style={{ position: 'absolute', top: hp(70), right: wp(30) }}
            style={{ alignSelf: 'center', marginRight: wp(10) }}
          >
            <Image
              style={{ height: hp(16), width: hp(16) }}
              source={require('../../assets/closeIcon.png')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          inverted
          style={{
            flex: 1,
            backgroundColor: theme.SimpuWhite,
            paddingHorizontal: hp(10),
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={threadMessagesRefetch}
            />
          }
          data={messages ?? []}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <ChatItem item={item} index={index} />
          )}
          ListEmptyComponent={() => (
            <View>
              <Text>Start a conversation</Text>
            </View>
          )}
        />
        <View>
          <ChatInput
            message={message}
            setMessage={setMessage}
            pickFile={pickFile}
            attachements={attachements}
            handleSendMessage={handleSendMessage}
            onUploaded={handleFileUploadCompleted}
            onDelete={handleDeleteUploadedFile}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
