import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import { theme } from '../utils/theme';
import { useChatProvider } from '../context';
import { fs, hp } from '../utils/config';

type AgentsCardProps = {
  size: 'small' | 'big';
};
const AgentsCard = ({ size }: AgentsCardProps) => {
  const { orgSettings } = useChatProvider();
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      flexDirection: 'row',
    },
    extraContainer: {
      backgroundColor: theme.SimpuGray,
      height: size === 'small' ? hp(20) : hp(50),
      width: size === 'small' ? hp(20) : hp(50),
      borderRadius: size === 'small' ? hp(20) : hp(50),
      alignItems: 'center',
      justifyContent: 'center',
    },
    extraText: {
      color: theme.SimpuBlack,
      fontSize: size === 'small' ? fs(12) : fs(16),
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
            size={size}
          />
        );
      })}
      {orgSettings?.members?.length! > 5 && (
        <View style={styles.extraContainer}>
          <Text style={styles.extraText}>
            +{orgSettings?.members?.length! - 5}
          </Text>
        </View>
      )}
    </View>
  );
};

export default AgentsCard;
