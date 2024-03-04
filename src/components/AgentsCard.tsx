import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { fs, hp } from '../utils/config';

const AgentsCard = () => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      flexDirection: 'row',
    },
    extraContainer: {
      backgroundColor: theme.SimpuGray,
      height: hp(50),
      width: hp(50),
      borderRadius: hp(25),
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraText: {
      color: theme.SimpuBlack,
      fontSize: fs(16),
      fontWeight: '600',
    },
  });
  return (
    <View style={styles.container}>
      {orgSettings?.members?.slice(0, 5)?.map((ite, i) => {
        return (
          <Avatar
            name={ite?.name}
            imgUrl={ite?.image_url}
            key={i}
            index={i}
            agentLength={orgSettings?.members?.length}
          />
        );
      })}
      {orgSettings?.members?.length > 5 && (
        <View style={styles.extraContainer}>
          <Text style={styles.extraText}>
            +{orgSettings?.members?.length - 5}
          </Text>
        </View>
      )}
    </View>
  );
};

export default AgentsCard;
