import {Text, View} from 'react-native';
import React from 'react';
import { hp } from '../utils/config';
import { formatMarginalDate } from '../utils/date';
import { theme } from '../utils/theme';


const TimeInterval = ({
  marginalTime,
}: {
  type?: string;
  index?: number;
  marginalTime: string | Date;
}) => {
  return (
    <View style={{marginVertical: hp(20), position: 'relative'}}>
      <View
        style={{
          height: hp(0.2),
          width: '100%',
          backgroundColor: theme.SimpuDarkGray,
          position: 'absolute',
          bottom: hp(9),
        }}
      />
      <View
        style={{
          backgroundColor: theme.SimpuPaleWhite,
          maxWidth: hp(300),
          alignSelf: 'center',
          paddingHorizontal: hp(8),
          paddingVertical: hp(4),
          borderRadius:hp(6)
        }}>
        <Text
          style={{
            color:theme.SimpuDarkGray,
            fontSize: 9,
            textAlign: 'center',
          }}>
          {formatMarginalDate(new Date(marginalTime))}
        </Text>
      </View>
    </View>
  );
};

export default TimeInterval;
