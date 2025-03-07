//@ts-nocheck
import { StyleSheet, Text, View, Platform,  Image } from 'react-native';
import React, { useState } from 'react';
import { theme } from '../utils/theme';
import AgentsCard from '../components/AgentsCard';
import SocialCard from '../components/SocialCard';
import { useChatProvider } from '../context';
import {
  responseTimeLabelRegister,
  trimText,
  useActiveSessionQuery,
  useBusinessHoursCheck,
} from '../utils';
import { SCREEN_HEIGHT, fs, hp, wp } from '../utils/config';
import LongBtn from '../components/LongBtn';
import apiClient from '../Provider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlatList } from 'react-native';
import Avatar from '../components/Avatar';
import type { conversationType } from '../@types/types';
import { TouchableOpacity } from 'react-native';
import { formatMessageDateTime } from '../utils/date';


const Start = () => {
  const {
    AppId,
    setViewIndex,
    orgSettings,
    apps,
    userHash,
    userId,
    setSessionID,
  } = useChatProvider();

  const [showConversations, setshowConversations] = useState(false);

  const fetchConversations = ({ pageParam = 1 }) => {
    return apiClient.inbox.livechat.getUserConversations(
      AppId,
      { page: pageParam },
      {
        headers: {
          Authorization: userHash ? `ssr__${userHash}` : undefined,
        },
      }
    );
  };

  const { data: activeSession } = useActiveSessionQuery(
    { app_id: AppId, signed_request: userHash },
    { enabled: !!userHash }
  );

  // console.log("activeSession",JSON.stringify(activeSession,null,3))


  //@ts-ignore
  const { data } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!userHash,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page < lastPage.meta.page_count
        ? lastPage.meta.page + 1
        : undefined;
    },
  });

  const conversations =
    data?.pages?.reduce((acc, page) => [...acc, ...page?.sessions], []) ?? [];

  // console.log('conversations', JSON.stringify(conversations, null, 3));

  // console.log("orgSettings", JSON.stringify(orgSettings,null,3));
  const styles = StyleSheet.create({
    container: {
      height: SCREEN_HEIGHT * 0.55,
      marginTop:
        Platform.OS === 'android'
          ? -SCREEN_HEIGHT * 0.06
          : -SCREEN_HEIGHT * 0.04,
      marginHorizontal: wp(20),
    },
    headerContainer: {
      padding: hp(5),
      backgroundColor: theme.SimpuWhite,
      borderRadius: hp(15),
    },
    bottomContainer: {
      marginTop: hp(20),
      paddingTop: hp(15),
      borderTopColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      borderTopWidth: hp(4),
      backgroundColor: theme.SimpuWhite,
      borderRadius: hp(15),
      padding: hp(10),
    },
    sendMsgBtn: {
      height: hp(40),
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: hp(10),
      marginHorizontal: hp(15),
      marginVertical: hp(10),
    },
    sendMsgTxt: {
      color: theme.SimpuWhite,
      fontSize: fs(16),
    },

    openHrsText: {
      fontSize: fs(16),
      color: theme.SimpuBlack,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      height: hp(300),
      maxHeight: hp(400),
    },
  });

  const business_hours = orgSettings?.business_hours;
  const show_business_hours = orgSettings?.show_business_hours;
  const response_time = orgSettings?.response_time;
  // const { show_business_hours, business_hours, response_time } = orgSettings;

  const hasBusinessHours =
    show_business_hours &&
    !!Object.keys(business_hours?.schedules ?? {}).filter(
      (key) => business_hours?.schedules?.[key]?.is_active
    ).length;

  const { isAvailable, nextAvailableDay } =
    useBusinessHoursCheck(business_hours);

  // console.log('has business hrs', hasBusinessHours);

  const handleSendMessage = () => {
    if (userId) {
      if (!!activeSession?.session) {
        setSessionID(activeSession?.session?.session_id);

        setViewIndex(3);
      } else {
        setViewIndex(3);
      }
    } else {
      setViewIndex(2);
    }
  };

  const handleContinueConversation = (sessionId: string) => {
    setSessionID(sessionId);
    setViewIndex(3);
  };
  const openConversationBox = () => {
    setshowConversations(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ padding: hp(16) }}>
          <Text
            style={{
              fontSize: fs(20),
              paddingVertical: hp(4),
              color: theme.SimpuBlack,
            }}
          >
            Start a conversation
          </Text>
          {hasBusinessHours ? (
            isAvailable ? (
              <Text style={styles.openHrsText}>
                {response_time
                  ? `The team typically replies ${responseTimeLabelRegister?.[response_time]}`
                  : "We'll reply as soon as we can"}
              </Text>
            ) : (
              <Text style={styles.openHrsText}>
                We'll be back on {nextAvailableDay}
              </Text>
            )
          ) : (
            <Text style={styles.openHrsText}>
              We'll reply as soon as we can
            </Text>
          )}
        </View>
        <AgentsCard size="big" />
        <LongBtn btnTitle="Send us a message" handlePress={handleSendMessage} />
      </View>
      <View style={styles.bottomContainer}>
        {!showConversations && (
          <>
            {userId && !!conversations?.length && (
              <View style={{ marginVertical: hp(6) }}>
                <LongBtn
                  btnTitle="Continue your conversation"
                  handlePress={openConversationBox}
                />
              </View>
            )}
          </>
        )}

        {showConversations && (
          <View style={styles.modalView}>
            <View
              style={{
                marginVertical: hp(8),
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                onPress={() => setshowConversations(false)}
                style={{
                  height: hp(30),
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={require('../assets/arrowIcon.png')}
                  style={{ height: hp(24), width: hp(24), padding: hp(10) }}
                />
              </TouchableOpacity>

              <View style={{ alignSelf: 'center', flex: 1 }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: fs(16),
                    fontWeight: '600',
                    textAlign: 'center',
                    marginRight: hp(20),
                  }}
                >
                  Your Conversations
                </Text>
              </View>
            </View>
            <FlatList
              data={conversations ?? []}
              style={{ width: '100%' }}
              contentContainerStyle={{ paddingTop: hp(15) }}
              keyExtractor={(item: conversationType) => `${item?.uuid}`}
              renderItem={({ item }) => (
                <ConversationItem
                  item={item}
                  handleContinueConversation={handleContinueConversation}
                />
              )}
            />
          </View>
        )}

        {!showConversations && (
          <>
            {apps?.length > 0 && (
              <View>
                <Text
                  style={{
                    paddingHorizontal: wp(10),
                    color: theme.SimpuBlack,
                    fontSize: fs(16),
                    fontWeight: '600',
                  }}
                >
                  Contact us on our socials
                </Text>
                <SocialCard />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const ConversationItem = ({
  item,
  handleContinueConversation,
}: {
  item: conversationType;
  handleContinueConversation: (id: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => handleContinueConversation(item?.last_message?.session_id)}
      style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginHorizontal: hp(10),
        borderRadius: hp(10),
        paddingHorizontal: hp(10),
        paddingVertical: hp(8),
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          name={item.last_message?.author?.name}
          index={0}
          imgUrl={item.last_message?.author?.image_url}
          size="small"
        />
        <View style={{ marginLeft: hp(20), width: '85%'}}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.SimpuBlack }}>
              {trimText(item.last_message?.author?.name, 25)}
            </Text>
            <Text style={{ color: theme.SimpuDarkGray, fontSize: fs(12) ,marginRight:hp(10)}}>
              {formatMessageDateTime(item?.last_message?.created_datetime)
           }
            </Text>
          </View>
          <View>
            <Text style={{ color: theme.SimpuDarkGray }}>
              {trimText(item.last_message?.entity.content?.body, 30)}
            </Text>
          </View>
        </View>
      </View>

      <Image
        source={require('../assets/backIcon.png')}
        style={{
          width: hp(15),
          height: hp(15),
          // marginRight:hp(20),
          transform: [{ rotate: '180deg' }],
        }}
      />
    </TouchableOpacity>
  );
};

export default Start;
