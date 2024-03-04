import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import ChatInput from '../components/ChatInput';
import { useChatProvider } from '../context';
import { format } from 'date-fns';
import { SCREEN_HEIGHT, SCREEN_WIDTH, fs, hp } from '../utils/config';
import { ChatData, agents } from '../utils/dummyData';

const Chat = () => {
  const { setViewIndex, orgSettings } = useChatProvider();
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
          alignSelf: item?.userType === 'agent' ? 'flex-start' : 'flex-end',
          padding: hp(5),
          marginVertical: hp(10),
          maxWidth: SCREEN_WIDTH * 0.75,
        }}
      >
        <View
          style={{
            paddingVertical: hp(6),
            paddingHorizontal: hp(8),
            borderRadius: hp(4),
            backgroundColor:
              item?.userType === 'agent'
                ? orgSettings?.style?.background_color ?? theme?.SimpuBlue
                : theme.SimpuPaleWhite,
          }}
        >
          <Text
            style={{
              lineHeight: 22,
              color:
                item?.userType === 'agent'
                  ? theme.SimpuWhite
                  : theme.SimpuBlack,
            }}
          >
            {item?.message}
          </Text>
          <Text
            style={{
              color:
                item?.userType === 'agent'
                  ? theme.SimpuWhite
                  : theme.SimpuBlack,
              fontSize: fs(9),
              paddingVertical: hp(4),
              alignSelf: 'flex-end',
            }}
          >
            {format(new Date(item?.date) ?? new Date(), 'p')}
          </Text>
        </View>
        {item.userType === 'agent' && (
          <Text
            style={{
              paddingTop: hp(4),
              color: orgSettings?.style?.background_color ?? theme.SimpuBlue,
              fontSize: fs(12),
            }}
          >
            Agent: {item?.name}
          </Text>
        )}
      </View>
    );
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
            <Image
              resizeMode="contain"
              style={styles.imageStyle}
              source={{ uri: `https://i.pravatar.cc/150?img=${3}` }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: hp(5) }}>
            <Text style={styles.NameText}>Waka Waka</Text>
            <Text style={styles.responseTimeText}>
              Typically replies in an hour
            </Text>
          </View>
        </View>
        <FlatList
          style={{
            flex: 1,
            backgroundColor: theme.SimpuWhite,
            paddingHorizontal: hp(10),
          }}
          data={ChatData}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <ChatList item={item} index={index} />
          )}
        />
        <ChatInput />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
