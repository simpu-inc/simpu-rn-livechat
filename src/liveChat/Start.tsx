import { StyleSheet, Text, TouchableOpacity, View ,Platform} from 'react-native';
import React from 'react';
import { theme } from '../utils/theme';
import AgentsCard from '../components/AgentsCard';
import SocialCard from '../components/SocialCard';
import { useChatProvider } from '../context';
import { responseTimeLabelRegister, useBusinessHoursCheck } from '../utils';
import { SCREEN_HEIGHT, fs, hp, wp } from '../utils/config';


const Start = () => {
  const { setViewIndex, orgSettings } = useChatProvider();


  // console.log("orgSettings", JSON.stringify(orgSettings,null,3));
  const styles = StyleSheet.create({
    container: {
      height: SCREEN_HEIGHT * 0.55,
      marginTop:Platform.OS==='android' ? -SCREEN_HEIGHT * 0.06 : -SCREEN_HEIGHT*0.04,
      marginHorizontal: wp(20),
    },
    headerContainer: {
      padding: hp(5),
      backgroundColor: theme.SimpuWhite,
      borderRadius: hp(15),
    },
    SocialsContainer: {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ padding: hp(16) }}>
          <Text style={{ fontSize: fs(20), paddingVertical: hp(4),color: theme.SimpuBlack}}>
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
        <AgentsCard size="big" />
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
    </View>
  );
};

export default Start;
