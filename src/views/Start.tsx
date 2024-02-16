import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { deviceHeight } from '../utils/responsiveConfig';
import { theme } from '../utils/theme';
import { agents } from '../utils/SampleData';
import AgentsCard from '../components/AgentsCard';
import SocialCard from '../components/SocialCard';
import { useChatProvider } from '../context';

const Start = () => {
  const { setViewIndex, orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    container: {
      height: deviceHeight * 0.6,
      marginTop: -deviceHeight * 0.05,
      marginHorizontal: 20,
    },
    headerContainer: {
      padding: 5,
      backgroundColor: theme.SimpuWhite,
      borderRadius: 15,
    },
    SocialsContainer: {
      marginTop: 30,
      paddingTop: 20,
      borderTopColor: orgSettings?.brandColor ?? theme.SimpuBlue,
      borderTopWidth: 4,
      backgroundColor: theme.SimpuWhite,
      borderRadius: 15,
      padding: 10,
    },
    sendMsgBtn: {
      height: 40,
      backgroundColor: orgSettings?.brandColor ?? theme.SimpuBlue,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginHorizontal: 15,
      marginVertical: 15,
    },
    sendMsgTxt: {
      color: theme.SimpuWhite,
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 22, paddingVertical: 5 }}>
            Start a conversation
          </Text>
          <Text style={{ fontSize: 14 }}>We'll be back on friday</Text>
        </View>
        <AgentsCard agents={agents} />
        <TouchableOpacity
          style={styles.sendMsgBtn}
          onPress={() => setViewIndex(2)}
        >
          <Text style={styles.sendMsgTxt}>Send us a message</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.SocialsContainer}>
        <Text
          style={{
            paddingHorizontal: 10,
            color: theme.SimpuBlack,
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Contact us on our socials
        </Text>
        <SocialCard />
      </View>
    </View>
  );
};

export default Start;
