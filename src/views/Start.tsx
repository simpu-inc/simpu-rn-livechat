import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { deviceHeight } from '../utils/responsiveConfig';
import { theme } from '../utils/theme';
import AgentsCard from '../components/AgentsCard';
import SocialCard from '../components/SocialCard';
import { useChatProvider } from '../context';
import { responseTimeLabelRegister, useBusinessHoursCheck } from '../utils';

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
      borderTopColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
      borderTopWidth: 4,
      backgroundColor: theme.SimpuWhite,
      borderRadius: 15,
      padding: 10,
    },
    sendMsgBtn: {
      height: 40,
      backgroundColor: orgSettings?.style?.background_color ?? theme.SimpuBlue,
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

    openHrsText: {
      fontSize: 16,
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

  console.log('has business hrs', hasBusinessHours);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 22, paddingVertical: 5 }}>
            Start a conversation
          </Text>
          {hasBusinessHours ? (
            isAvailable ? (
              <Text style={styles.openHrsText}>
                {response_time
                  ? `The team typically replies ${responseTimeLabelRegister[response_time]}`
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
          {/* <Text style={{ fontSize: 14 }}>We'll be back on friday</Text> */}
        </View>
        <AgentsCard />
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
