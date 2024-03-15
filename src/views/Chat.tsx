import {
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
import { theme } from '../utils/theme';
import ChatInput from '../components/ChatInput';
import { useChatProvider } from '../context';
import { format } from 'date-fns';
import { SCREEN_HEIGHT, SCREEN_WIDTH, fs, hp } from '../utils/config';
import { ChatData, agents } from '../utils/dummyData';
import DocumentPicker from 'react-native-document-picker';
import {
  fetchThreadMessages,
  generateNewMessage,
  getConversationMessages,
  responseTimeRegister,
  sendMessage,
  useSessionQuery,
} from '../utils';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import AgentsCard from '../components/AgentsCard';
import { acceptedFileTypes } from '../@types/types';

const Chat = () => {
  const queryClient = useQueryClient();
  const { AppId, userHash, sessionID, setViewIndex, orgSettings } =
    useChatProvider();

  const { mutate: mutateSendMessage } = useMutation(
    (payload) => {
      return sendMessage(payload, AppId, userHash);
    },
    {
      onMutate: async (data) => {
        const { attachments, user_id, content } = data;
        const newMessage = generateNewMessage({
          attachments,
          user_id,
          content,
        });

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
        // setUploadedFiles();

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
    }
  );
  const [refreshing, setRefreshing] = useState(false);

  console.log('userHassh inside chat...', userHash);
  const { data: session } = useSessionQuery(
    {
      app_id: AppId,
      session_id: sessionID,
    },
    { enabled: !!sessionID, initialData: orgSettings?.members }
  );

  console.log('Session from use session', JSON.stringify(session, null, 3));

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
      console.log(
        'nextPage from inifinite query',
        JSON.stringify(lastPage, null, 3)
      );
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

  console.log('Thread message:===', JSON.stringify(threadMessages, null, 3));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.12,
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      // justifyContent: 'center',
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

  const ChatList = ({ item, index }: { item: any; index: number }) => {
    // console.log('itemsss', JSON.stringify(item, null, 2));
    return (
      <View
        style={{
          marginBottom: index === 0 ? hp(120) : hp(3),
          alignSelf: item?.by_account ? 'flex-start' : 'flex-end',
          padding: hp(5),
          marginVertical: hp(8),
          maxWidth: SCREEN_WIDTH * 0.75,
        }}
      >
        <View
          style={{
            paddingVertical: hp(6),
            paddingHorizontal: hp(8),
            borderRadius: hp(8),
            backgroundColor: item?.by_account
              ? orgSettings?.style?.background_color ?? theme?.SimpuBlue
              : theme.SimpuPaleWhite,
          }}
        >
          <Text
            style={{
              lineHeight: 22,
              color: item?.by_account ? theme.SimpuWhite : theme.SimpuBlack,
            }}
          >
            {item?.entity?.content?.body}
          </Text>
          <Text
            style={{
              color: item?.by_account ? theme.SimpuWhite : theme.SimpuBlack,
              fontSize: fs(9),
              paddingVertical: hp(4),
              alignSelf: 'flex-end',
            }}
          >
            {format(new Date(item?.created_datetime) ?? new Date(), 'p')}
          </Text>
        </View>
        {item?.by_account && (
          <Text
            style={{
              paddingTop: hp(4),
              color: orgSettings?.style?.background_color ?? theme.SimpuBlue,
              fontSize: fs(12),
            }}
          >
            Agent: {item?.author?.name ?? item?.author?.Platform_name}
          </Text>
        )}
      </View>
    );
  };

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
      };

      // const isFileTooLarge = file?.size !== null && file?.size >= 10271520;

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
    }
  };

  const handleSendMessage = () => {
    if (userHash) {
      mutateSendMessage({
        user_id,
        content: text,
        attachment_ids: uploadedFiles,
      });
    } else {
      // clearState();
      setHomeSectionStep(1);
      history.push('/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setViewIndex(1)}
          >
            <Image
              source={require('../assets/backIcon.png')}
              style={{ height: hp(18), width: hp(18), marginRight: hp(5) }}
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
        <FlatList
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
            <ChatList item={item} index={index} />
          )}
          ListEmptyComponent={() => (
            <View>
              <Text>Start a conversation</Text>
            </View>
          )}
        />
        <ChatInput pickFile={pickFile} handleSendMessage={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
