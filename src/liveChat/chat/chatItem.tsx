import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { fs, hp, SCREEN_WIDTH } from '../../utils/config';
import { theme } from '../../utils/theme';
import { useChatProvider } from '../../context';
import { format } from 'date-fns';
import type { messageType } from '../../@types/types';
import File from './File';

const ChatItem = ({ item, index }: { item: messageType; index: number }) => {
  // console.log('itemsss', JSON.stringify(item, null, 2));
  const { AppId, userHash, sessionID, orgSettings } = useChatProvider();

  const { entity } = item;

  if (entity?.attachments.length > 0) {
    <File files={entity?.attachments} />;
  }

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

export default ChatItem;
