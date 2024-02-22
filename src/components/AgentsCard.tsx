import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';

const AgentsCard = () => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      flexDirection: 'row',
    },
    extraContainer: {
      backgroundColor: theme.SimpuGray,
      height: 50,
      width: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraText: {
      color: theme.SimpuBlack,
      fontSize: 16,
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
