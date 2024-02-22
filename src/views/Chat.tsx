import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { deviceHeight, deviceWidth } from '../utils/responsiveConfig';
import { theme } from '../utils/theme';
import ChatInput from '../components/ChatInput';
import { useChatProvider } from '../context';
import { format } from 'date-fns';

const Chat = () => {
  const { setViewIndex, orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      height: deviceHeight * 0.15,
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      // justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
    },

    imageStyle: {
      height: 40,
      width: 40,
      borderRadius: 25,
      borderWidth: 1.3,
      borderColor: theme.SimpuWhite,
    },
    NameText: {
      color: theme.SimpuPaleWhite,
      fontSize: 18,
    },
    responseTimeText: {
      color: theme.SimpuPaleWhite,
      fontSize: 14,
    },
  });

  const ChatList = ({ item, index }: { item: any; index: number }) => {
    // console.log('itemsss', JSON.stringify(item, null, 2));
    return (
      <View
        style={{
          alignSelf: item?.userType === 'agent' ? 'flex-start' : 'flex-end',
          padding: 5,
          marginVertical: 10,
          maxWidth: deviceWidth * 0.7,
        }}
      >
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderRadius: 4,
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
              fontSize: 9,
              paddingVertical: 4,
              alignSelf: 'flex-end',
            }}
          >
            {format(new Date(item?.date), 'p')}
          </Text>
        </View>
        {item.userType === 'agent' && (
          <Text
            style={{
              paddingTop: 4,
              color: orgSettings?.style?.background_color ?? theme.SimpuBlue,
              fontSize: 12,
            }}
          >
            Agent: {item?.name}
          </Text>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setViewIndex(1)}
        >
          <Image
            source={require('../assets/backIcon.png')}
            style={{ height: 18, width: 18, marginRight: 5 }}
          />
          <Image
            resizeMode="contain"
            style={styles.imageStyle}
            source={{ uri: `https://i.pravatar.cc/150?img=${3}` }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 5 }}>
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
          paddingHorizontal: 10,
        }}
        data={ChatData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => <ChatList item={item} index={index} />}
      />
      <ChatInput />
    </View>
  );
};

export default Chat;
